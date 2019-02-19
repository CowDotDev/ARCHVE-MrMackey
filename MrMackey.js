var { Client } = require('discord.js');
var auth = require('./auth.json');
var Twitter = require('./twitter.js');
var Commands = require('./commands/declarations.js');
var Custom = require('./commands/customFunctions.js');

// Initialize Discord Bot
var bot = new Client();

bot.on('ready', () => {
  console.log(`Connected as: %s`, bot.user.tag);
  console.log("Connecting to Twitter...");
  Twitter.requestBearerToken();
});

bot.on('message', message => {
  if(message.content.substring(0,1) === "!") {
    var command = message.content.substring(1).split(" ")[0].toLowerCase(),
        params = message.content.split(" ").slice(1),
        commandFound = false;
    for(let i = 0; i < Commands.length; i++) {
      let cmd = Commands[i];
      commandFound = (cmd.command == command);
      if(commandFound) {
        // Our command matches, run the action. Check to see if it accepts parameters, or if the user requested !list
        cmd.action(message,(cmd.hasParams ? params : (cmd.command === "list" ? Commands : "")));
        break;
      }
    }

    // No hard coded command was found, try to excute a custom command.
    // If none are found, this method will have Mr.Mackey respond with a no command found message.
    if(!commandFound) { Custom.executeCustomCommand(message,command); }
  }
});

bot.login(auth.token);