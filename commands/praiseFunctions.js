let PouchDB = require('pouchdb');
let dbUrl = "http://localhost:5984/praise-";

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
    let db = new PouchDB(`${dbUrl}server-${serverId}`);
    db.allDocs({
      include_docs: true,
      attachments: false
    }).then(documents => {
      // Go through each row, get the username and their point value
    }).catch(error => {
      console.log(`Get Points Scoreboard DB Error: ${JSON.stringify(error)}`);
    });
  } else {
    message.reply("I can only get the scoreboard if we're in a server, and we don't appear to be in one... m'kay");
  }
};

/**
 * Command: ++
 * Params:
 *  - [0] = User
 * Desc: Increment 
 */
module.exports.incrementScore = (message,params) => {

};