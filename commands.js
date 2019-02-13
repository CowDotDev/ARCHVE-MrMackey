var { Attachment } = require("discord.js");
var Twitter = require('./twitter.js');
var api = require('axios');

/**
 * Command: !drugs
 * Params: None
 * Desc: Classic Mr.Mackey
 */
exports.drugsAreBad = () => {
  message.reply("Drugs are bad, m'kay.");
};

/**
 * Command: !pizza
 * Params: None
 * Desc: Returns a gif of "Pizza Time" Peter Parker
 */
exports.pizzaTime = (message) => {
  const gif = new Attachment("https://media1.tenor.com/images/7a71a41ed97deac3853402c2b747895d/tenor.gif");
  message.channel.send(gif);
};

/**
 * Command: !xkcd
 * Params: None
 * Desc: Returns a random xkcd comic.
 */
exports.getRandomXkcd = (message) => {
  const maxId = 2110; // This is the maximum ID that doesn't 404, as of 2/11/2019
  let random_number = Math.random() * (maxId-0) + 0;
  let comicId = Math.floor(random_number);
  api.get(`https://xkcd.com/${comicId}/info.0.json`)
    .then(response => {
      const comic = new Attachment(response.data.img);
      message.channel.send(comic);
    })
    .catch(() => {
      message.channel.send("Couldn't retrieve xkcd comic... m'kay.");
    });
}

/**
 * Command: !twitter
 * Params:
 *  - [0] = Twitter User Screen Name
 *  - [1] = Number of Tweets (Optional | Default: 1)
 * Desc: Returns a link for each most recent tweet found by the screen name provided, by default provides only the most recent, but count parameter may be supplied to get up to 5.
 */
exports.getTweetsByScreenName = (message, params) => {
  if(typeof params !== "undefined" && Array.isArray(params) && params.length > 0) {
    let screenName = params[0],
        count = (typeof params[1] !== "undefined" && !isNaN(params[1]) ? params[1] : 1);
    Twitter.getMostRecentTweetByScreenName(screenName, count, message);
  } else {
    message.reply("!twitter command must include the Twitter user's screen name. (Ex. !twitter realDonaldTrump)");
  }
}

/**
 * Command: !trump
 * Params:
 *  - [0] = Number of Tweets (Optional | Default: 1)
 * Desc: Returns a link for each most recent tweet from @realDonaldTrump. By default, only his most recent tweet will be returned, count parameter may be supplied to get up to 5.
 */
exports.getTweetsFromTrump = (message, params) => {
  let count = (typeof params[0] !== "undefined" && !isNaN(params[0]) ? params[0] : 1);
  Twitter.getMostRecentTweetByScreenName("realDonaldTrump", count, message);
}