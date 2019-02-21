let dbAuth = require('../util/database');
let dbName = "custom-commands-";

/**
 * =====================================================================================================================================
 * Custom Commands are specific to the server/guild or DM Channel that they were defined in.
 * Currently, we don't check for DMChannel id - as Mr.Mackey doesn't accept friend requests (yet) so he can't be part of DM Group Chats.
 * However, if he some how enters into a DM Group Chat, things should still be specifc to that DM Group Channel.  (Untested)
 * =====================================================================================================================================
 */

/**
 * Command: None
 * Params: None
 * Desc: This method returns an array of all the custom commands, along with the command's response.
 * Returns: Array[Object]
 */
module.exports.getListOfCustomCommands = (message) => {
  let dbId = (message.channel.type === "text" ? "server-"+message.guild.id : "dm-"+message.channel.id);
  return dbAuth(`${dbName}${dbId}`).allDocs();
};

/**
 * Command: !on
 * Params:
 *  - [0] = Command
 *  - [1] = Command's Return Value
 * Desc: Allows for users to create custom commands that simply returns a string.
 */
module.exports.createCustomCommand = (message, params) => {
  let dbId = (message.channel.type === "text" ? "server-"+message.guild.id : "dm-"+message.channel.id),
      db = dbAuth(`${dbName}${dbId}`);

  // First, make sure both a command and response have been supplied
  let cmd = (typeof params !== "undefined" && Array.isArray(params) && params.length > 0 ? params.shift().toLowerCase() : ""),
      cmdResponse = (typeof params !== "undefined" && Array.isArray(params) && params.length > 0 ? params.join(" ") : "");
  if(typeof cmd === "undefined" || cmd == "") {
    message.reply("I couldn't figure out what your custom command was hooking too... m'kay (Ex. !on cow moo moo -> !cow -> moo moo)");
    return false;
  } else if(typeof cmdResponse === "undefined" || cmdResponse == "") {
    message.reply(`I couldn't figure out what you wanted **!${cmd}** to do... m'kay (Ex. !on ${cmd} I'll say this! -> !${cmd} -> I'll say this!)`);
    return false;
  }

  // We have the cmd and cmdResponse, check to see if cmd already exists.
  // If so, then we want to ask the person if they are sure they want to overwrite the cmd.
  // If not, create the cmd with the given cmdResponse
  let cmdExists = true;
  db.get(cmd)
    .catch(error => {
      if (error.name === 'not_found') {
        cmdExists = false;
        return {
          _id: cmd,
          response: cmdResponse,
          owner: message.author.username
        };
      } else { // hm, some other error
        throw error;
      }
    })
    .then(doc => {
      if(!cmdExists) {
        // We do not have this cmd yet, should have been created since cmdExists is false and we're not in the final catch.
        db.put(doc);
        message.reply(`The command **!${cmd}** has been created... m'kay`);
      } else {
        // We have an existing Doc, ask user if we should overwrite.
        const filter = collectorMsg => {
          return (collectorMsg.author.id === message.author.id && 
            (collectorMsg.content.toLowerCase().includes("yes") || collectorMsg.content.toLowerCase().includes("no")));
        }

        message.reply(`${doc.owner} has already created **!${cmd}** which responds with: **${doc.response}**. Are you sure you want to overwrite? (yes/no)`)
          .then(res => {
            // Set up collector to get response
            message.channel.awaitMessages(filter, { maxMatches: 1, time: 30000, errors: ['time'] })
              .then(collected => {
                // Check to see if yes or no
                if(collected.first().content.includes("yes")) {
                  // Overwrite Commamnd
                  doc.response = cmdResponse;
                  doc.owner = message.author.username;
                  db.put(doc);

                  message.reply(`The command **!${cmd}** has been updated... m'kay`);
                } else {
                  // Do NOT Overwrite Command
                  message.reply(`M'kay, I will leave **!${cmd}** as is.`);
                }
              })
              .catch(collected => {
                console.log(collected);
                message.reply(`I didn't get an answer in time... m'kay. Not overwriting **!${cmd}**.`);
              });
          });
      }
    })
    .catch(error => {
      console.log(`Custom Command DB GET Error: ${error}`);
      message.reply("There was an error accessing the database... m'kay");
    });
};

/**
 * Command: !{custom}
 * Params: None
 * Desc: We get to this command if Mr.Mackey doesn't have any hard coded commands that match. We need to search our DB for any documents in custom-commands that match the command give. If found, send the response. Otherwise, send no command found message.
 */
module.exports.executeCustomCommand = (message,command) => {
  let dbId = (message.channel.type === "text" ? "server-"+message.guild.id : "dm-"+message.channel.id);
  dbAuth(`${dbName}${dbId}`)
    .get(command)
    .then(doc => {
      // We have a match, send the response then return true
      message.channel.send(doc.response);
    })
    .catch(error => {
      // No Match, send no command found message.
      message.reply("No command found, m'kay. You can use **!list** to view all commands I know.");
    });
};