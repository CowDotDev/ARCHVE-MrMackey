var { Client } = require('discord.js');
var auth = require('./auth.json');
var Twitter = require('./twitter.js');
var Commands = require('./commands/declarations.js');

// Initialize Discord Bot
var bot = new Client();

bot.on('ready', () => {
  console.log(`Connected as: %s`, bot.user.tag);
  console.log("Connecting to Twitter...");
  Twitter.requestBearerToken();
});

bot.on('message', message => {
  if(message.content.substring(0,1) === "!") {
    var command = message.content.substring(1).split(" ")[0],
        params = message.content.split(" ").slice(1),
        commandFound = false;
    for(let i = 0; i < Commands.length; i++) {
      let cmd = Commands[i];
      if(cmd.command == command) {
        // Our command matches, run the action. Check to see if it accepts parameters, or if the user requested !list
        cmd.action(message,(cmd.hasParams ? params : (cmd.command === "list" ? Commands : "")));
        commandFound = true;
        break;
      }
    }
    if(!commandFound) { message.reply("I don't know what to do, m'kay"); }
  }
});

bot.login(auth.token);