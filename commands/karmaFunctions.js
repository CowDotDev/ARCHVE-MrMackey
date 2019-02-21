let Helpers = require('../util/helpers.js');
let dbAuth = require('../util/database.js');
let dbName = "karma-";

/**
 * Command: !scoreboard
 * Params: None
 * Desc: Retrieve the point totals for all members in this server. (As of current, this does not return members that haven't been ++'d or --'d)
 */
module.exports.getScoreboard = (message) => {
  let serverId = (message.channel.type == "text" ? message.guild.id : "" );
  if(typeof serverId !== "undefined" && serverId !== "" ) {
    // We want to make sure we are only associate points for a specific user against a specific server ID.
    // Since we have a serverId, let's get all the records for this server.
    dbAuth(`${dbName}${serverId}`)
      .allDocs()
      .then(documents => {
        // Go through each row, get the username and their point value
      })
      .catch(error => {
        console.log(`Get Points Scoreboard DB Error: ${JSON.stringify(error)}`);
      });
  } else {
    message.reply("I can only get the scoreboard if we're in a server, and we don't appear to be in one... m'kay");
  }
};

/**
 * Command: ++ or --
 * Params:
 *  - [0] = User
 * Desc: Increment 
 */
module.exports.updateKarma = (message,fate) => {
  // We need to split the message into an array so we can interate through it to find where @user++ is so we can identify the user(s) being praised/condemed
  let deconstructedMsg = message.content.replace("> "+fate, ">"+fate).replace("> <@", "><@").split(" "),
      userIds = [];

  // Iterate through the deconstructed message, find the message where it starts with <@ and ends in our fate (++/--). When we do, break out.
  // <@{UID}> = Structure for mentioned user.
  for(let msgPart of deconstructedMsg) {
    if(msgPart.substring(0,2) === "<@" && msgPart.substring(msgPart.length - 2, msgPart.length) == fate) {
      // A user is allowed to ++ or -- multiple users are once by doing @user@user2++ so we need to make sure we get all userIds
      userIds = msgPart.match(/\d+/g);
      break;
    }
  };

  // Check to see if we have mentioned users
  if(userIds.length > 0) {
    let users = []
    for(let id of userIds) {
      users.push(message.guild.members.get(id).user);
    }

    // Update User's Score
    // Empty Array on the End to Hold Successful Users - as this function is recursive to handle async
    updateKarmaOnDB(message,users,fate,[]);
  }
};
let updateKarmaOnDB = (message,users,fate,successUsers) => {
  // Make sure we have users to modify
  if(users.length <= 0) {
    let mentions = "",
        scores = "";
    successUsers.forEach(user => { mentions += user.mention+" "; });
    successUsers.forEach(user => { scores += (successUsers.length > 1 ? `${user.username}: ${user.score} | ` : `Score: ${user.score}`) });

    // If we have more than one successful user we need to remove the trailing |
    if(successUsers.length > 1) scores = scores.substring(0, scores.length - 3);
    message.channel.send(mentions+(fate === "++" ? Helpers.generatePositiveKarmaResponse() : Helpers.generateNegativeKarmaResponse())+` (${scores})`);
    return;
  }

  // Make sure we are in a TextChannel for a Guild/Server
  if(message.channel.type !== "text" || typeof message.guild === "undefined" || isNaN(message.guild.id)) {
    message.reply("Karma only exists for chats in a server, m'kay.");
    return;
  }

  // Set Up DBs
  let db = dbAuth(dbName+message.guild.id),
      dbKarmaLog = dbAuth(`${dbName+message.guild.id}-log`);
  
  // Get the first user in the array to work with
  let user = users.shift();
  db.get(user.id)
    .catch(error => {
      // Check to see if we need to create their user record for this server
      if (error.name === 'not_found') {
        return {
          _id: user.id,
          username: user.username,
          score: 0
        };
      } else { // hm, some other error
        throw error;
      }
    })
    .then(doc => {
      let curScore = doc.score;
      doc.score = (fate == "++" ? curScore + 1 : curScore - 1);
      db.put(doc)
        .then(updatedDoc => {
          let successUsrObj = { 
            mention: `<@${user.id}>`, 
            score: doc.score, 
            username: user.username
          };

          // Log this Karma Event
          let log = {
            "_id": new Date().getTime().toString(),
            "target": user.username,
            "targetId": user.id,
            "author": message.author.username,
            "authorId": message.author.id,
            "fate": fate,
            "before": curScore,
            "after": doc.score
          };
          dbKarmaLog.put(log)
            .then(docLog => {
              // Push the successful user to the array, then keep going.
              successUsers.push(successUsrObj);
              updateKarmaOnDB(message,users,fate,successUsers);
            })
            .catch(error => {
              console.log(`Karma Logging Score ERROR: ${error}`);

              // Push the successful user to the array, then keep going. (Even though the log failed)
              successUsers.push(successUsrObj);
              updateKarmaOnDB(message,users,fate,successUsers);
            });
        })
        .catch(error => {
          console.log(`Karma Updating Score ERROR: ${error}`);
          message.reply(`Couldn't update <@${user.id}> 's score... m'kay`);
          updateKarmaOnDB(message,users,fate,successUsers);
        });
    })
    .catch(error => {
      console.log(`Karma Get User ERROR: ${error}`);
      message.reply(`Couldn't get <@${user.id}> 's score to update... m'kay`);
      updateKarmaOnDB(message,users,fate,successUsers);
    });
};