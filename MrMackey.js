var Discord = require('discord.js');
var api = require('axios');
var auth = require('./auth.json');
var Twitter = require('./twitter.js');

// Initialize Discord Bot
var bot = new Discord.Client();

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

      /**
       * Basic Mr.Mackey at his finest.
       */
      case "drugs":
        message.reply("Drugs are bad, m'kay.");
        break;

      /**
       * It's Pizza Time
       */
      case "pizza":
        const gif = new Discord.Attachment("https://media1.tenor.com/images/7a71a41ed97deac3853402c2b747895d/tenor.gif");
        message.channel.send(gif);
        break;

      /**
       * Random xkcd comic generator.
       */ 
      case "xkcd":
        const maxId = 2110; // This is the maximum ID that doesn't 404, as of 2/11/2019
        let random_number = Math.random() * (maxId-0) + 0;
        let comicId = Math.floor(random_number);
        api.get(`https://xkcd.com/${comicId}/info.0.json`)
          .then(response => {
            const comic = new Discord.Attachment(response.data.img);
            message.channel.send(comic);
          })
          .catch(() => {
            message.channel.send("Couldn't retrieve xkcd comic... m'kay.");
          });
        break;

      /**
       * Get Most Recent Tweet(s) From Any Screen Name
       * Params:
       * - 0: Screen Name
       * - 1: Number of Tweets (Optional)
       */
      case "twitter":
        var screenName = params[0],
            count = (typeof params[1] !== "undefined" && !isNaN(params[1]) ? params[1] : 1);
        Twitter.getMostRecentTweetByScreenName(screenName, count, message);  
        break;
    }
  }
});

bot.login(auth.token);


// bot.on('message', function (user, userID, channelID, message, evt) {
//     // Our bot needs to know if it will execute a command
//     // It will listen for messages that will start with `!`
//     if (message.substring(0, 1) == '!') {
//         var args = message.substring(1).split(' ');
//         var cmd = args[0];
       
//         args = args.splice(1);
//         switch(cmd) {
//             // !ping
//             case 'ping':
//                 bot.sendMessage({
//                     to: channelID,
//                     message: 'Pong!'
//                 });
//             break;
//             // Just add any case commands if you want to..
//          }
//      }
// });