var { Client } = require('discord.js');
var auth = require('./auth.json');
var Twitter = require('./twitter.js');
var Commands = require('./commands.js');

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
        params = message.content.split(" ").slice(1);
    switch(command) {
      // !drugs
      case "drugs":
        Commands.drugsAreBad(message);
        break;
      // !pizza
      case "pizza":
        Commands.pizzaTime(message);
        break;
      // !xkcd
      case "xkcd":
        Commands.getRandomXkcd(message);
        break;
      // !twitter {screen_name} {count (Optional)}
      case "twitter":
        Commands.getTweetsByScreenName(message, params);
        break;
      // !trump {count (Optional)}
      case "trump":
        Commands.getTweetsFromTrump(message, params);
        break;
    }
  }
});

bot.login(auth.token);