var { Attachment, RichEmbed } = require("discord.js");
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
      console.log("XKCD Comic GET Success");
      const comic = new Attachment(response.data.img);
      message.channel.send(comic);
    })
    .catch(() => {
      console.log(`XKCD Comic GET Error: ${e}`);
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

/**
 * Command: !ram
 * Params:
 *  - [0] = Search Term
 * Desc: Search https://masterofallscience.com website api for a scene in Rick and Morty that matches your search term
 */
exports.getMatchingRickAndMortyScene = (message, params) => {
  // Our search term can be multiple words, since we only have one parameter at the moment, let's just join together the params array into one string.
  let searchTerm = params.join(" ");
  api.get(`https://masterofallscience.com/api/search?q=${encodeURIComponent(searchTerm)}`)
    .then(response => {
      // Check the response data to see if any results were found. If so, grab a random scene and then we need to hit the caption endpoint
      console.log("Rick and Morty Search GET Success");
      let results = response.data,
          sceneIndex = Math.floor(Math.random() * (results.length-0) + 0),
          sceneTimestamp = results[sceneIndex].Timestamp,
          sceneEpisode = results[sceneIndex].Episode;
      api.get(`https://masterofallscience.com/api/caption?e=${sceneEpisode}&t=${sceneTimestamp}`)
        .then(response => {
          // Grab the Scene Information, Create a Rich Embed and then send!
          console.log("Rick and Morty Scene GET Success");
          let episode = response.data.Episode,
              subtitles = response.data.Subtitles
              embed = new RichEmbed();

          let gifStart = sceneTimestamp - 2000,
              gifEnd = sceneTimestamp + 2000;

          embed.setAuthor(episode.Title);

          // Check if subtitles is an odd number, if so shift the first index to the description and then we know the rest will be even (or 0).
          if(subtitles.length % 2 !== 0) {
            embed.setDescription(subtitles.shift().Content);
          }

          for(let i = 0; i < subtitles.length; i++) {
            // To get a zebra stripe effect, we're going to put two subtitles in a field at a time. If there isn't a "second subtitle" then we will subsitute for a blank string.
            let first = subtitles[i].Content,
                second = subtitles[++i].Content;
            embed.addField(first, second);
          }

          embed.setFooter(`Season ${episode.Season} | Episode ${episode.EpisodeNumber}`);

          api.get(`https://masterofallscience.com/gif/${sceneEpisode}/${gifStart}/${gifEnd}.gif`)
            .then(response => {
              setTimeout(function() {
                embed.setImage(`https://masterofallscience.com/gif/${sceneEpisode}/${gifStart}/${gifEnd}.gif`);
                message.channel.send(embed);
              }, 4000);
            });
        })
        .catch(e => {
          // This isn't an official API (at least, I don't think so) so I'm not sure if there are true errors to handle besides a general fail.
          console.log(`Rick and Morty Scene GET Error: ${e}`);
          message.reply("Something's messed up, m'kay. Couldn't retrieve scene information.");
        })
    })
    .catch(e => {
      // This isn't an official API (at least, I don't think so) so I'm not sure if there are true errors to handle besides a general fail.
      console.log(`Rick and Morty Search GET Error: ${e}`);
      message.reply("Something's messed up, m'kay. Couldn't retrieve search information.");
    })
}