let PouchDB = require('pouchdb');
let db = new PouchDB("http://localhost:5984/custom-commands");

/**
 * Command: None
 * Params: None
 * Desc: This method returns an array of all the custom commands, along with the command's response.
 * Returns: Array[Object]
 */
exports.getListOfCustomCommands = () => {
  return db.allDocs({
    include_docs: true,
    attachments: true
  });
};

/**
 * Command: !on
 * Params:
 *  - [0] = Command
 *  - [1] = Command's Return Value
 * Desc: Allows for users to create custom commands that simply returns a string.
 */
exports.createCustomCommand = (message, params) => {
  // First, make sure both a command and response have been supplied
  let cmd = (typeof params !== "undefined" && Array.isArray(params) && params.length > 0 ? params.shift().toLowerCase() : ""),
      cmdResponse = (typeof params !== "undefined" && Array.isArray(params) && params.length > 0 ? params.join(" ") : "");
  if(typeof cmd === "undefined" || cmd == "") {
    message.reply("I couldn't figure out what your custom command was hooking too... m'kay (Ex. !on cow moo moo -> !cow -> moo moo)");
    return false;
  } else if(typeof cmdResponse === "undefined" || cmdResponse == "") {
    message.reply(`I couldn't figure out what you wanted !${cmd} to do... m'kay (Ex. !on ${cmd} I'll say this! -> !${cmd} -> I'll say this!)`);
    return false;
  }

  // We have the cmd and cmdResponse, check to see if cmd already exists.
  // If so, then we want to ask the person if they are sure they want to overwrite the cmd.
  // If not, create the cmd with the given cmdResponse
  let cmdExists = true;
  db.get(cmd).catch(error => {
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
  }).then(doc => {
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
  }).catch(error => {
    console.log(`Custom Command DB GET Error: ${error}`);
    message.reply("There was an error accessing the database... m'kay");
  });
};

/**
 * Command: !{custom}
 * Params: None
 * Desc: We get to this command if Mr.Mackey doesn't have any hard coded commands that match. We need to search our DB for any documents in custom-commands that match the command give. If found, send the response. Otherwise, send no command found message.
 */
exports.executeCustomCommand = (message,command) => {
  db.get(command).then(doc => {
    // We have a match, send the response then return true
    message.channel.send(doc.response);
  }).catch(error => {
    // No Match, send no command found message.
    message.reply("No command found, m'kay. You can use **!list** to view all commands I know.");
  })
};