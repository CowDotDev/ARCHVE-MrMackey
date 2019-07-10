let { Attachment, RichEmbed } = require("discord.js");
let Helpers = require('../util/helpers.js');
let Twitter = require('../twitter.js');
let Custom = require('./customFunctions.js');
let api = require('axios');
var auth = require('../auth.json');

/**
 * Command: !drugs
 * Params: None
 * Desc: Classic Mr.Mackey
 */
module.exports.drugsAreBad = (message) => {
  message.reply("Drugs are bad, m'kay.");
};

/**
 * Command: !pizza
 * Params: None
 * Desc: Returns a gif of "Pizza Time" Peter Parker
 */
module.exports.pizzaTime = (message) => {
  const gif = new Attachment("https://media1.tenor.com/images/7a71a41ed97deac3853402c2b747895d/tenor.gif");
  message.channel.send(gif);
};

/**
 * Command: !xkcd
 * Params: None
 * Desc: Returns a random xkcd comic.
 */
module.exports.getRandomXkcd = (message) => {
  const maxId = 2110; // This is the maximum ID that doesn't 404, as of 2/11/2019
  let random_number = Math.random() * maxId;
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
module.exports.getTweetsByScreenName = (message, params) => {
  if(Helpers.isParamSet(params)) {
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
module.exports.getTweetsFromTrump = (message, params) => {
  let count = (typeof params[0] !== "undefined" && !isNaN(params[0]) ? params[0] : 1);
  Twitter.getMostRecentTweetByScreenName("realDonaldTrump", count, message);
}

/**
 * Command: !ram
 * Params:
 *  - [0] = Search Term
 * Desc: Search https://masterofallscience.com website api for a scene in Rick and Morty that matches your search term
 */
module.exports.getMatchingRickAndMortyScene = (message, params) => {
  // Our search term can be multiple words, since we only have one parameter at the moment, let's just join together the params array into one string.
  let searchTerm = params.join(" ");
  api.get(`https://masterofallscience.com/api/search?q=${encodeURIComponent(searchTerm)}`)
    .then(response => {
      // Check the response data to see if any results were found. If so, grab a random scene and then we need to hit the caption endpoint
      console.log("Rick and Morty Search GET Success");
      let results = response.data;
      if(results.length <= 0) {
        message.reply("Nothing found for that term!");
        return false;
      }

      let sceneIndex = Math.floor(Math.random() * results.length),
          sceneTimestamp = results[sceneIndex].Timestamp,
          sceneEpisode = results[sceneIndex].Episode;
      api.get(`https://masterofallscience.com/api/caption?e=${sceneEpisode}&t=${sceneTimestamp}`)
        .then(response => {
          // Grab the Scene Information, Create a Rich Embed and then send!
          console.log("Rick and Morty Scene GET Success");
          let episode = response.data.Episode,
              subtitles = response.data.Subtitles
              embed = new RichEmbed();

          let gifStart = sceneTimestamp - 1250,
              gifEnd = sceneTimestamp + 2750;

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

          // Set Loading Message
          let placeholder;
          message.channel.send("Loading Rick & Morty gif... m'kay").then(loadingMsg => { 
            placeholder = loadingMsg; 
          });

          let gifUrl = `https://masterofallscience.com/gif/${sceneEpisode}/${gifStart}/${gifEnd}.gif`;
          api.get(gifUrl)
            .then(response => {
              // We set this timeout to help the rendering of the gif to be clearer. Not always helpful... but not having it is 100% awful
              setTimeout(function() {
                embed.setImage(gifUrl);
                placeholder.delete(); // Delete Loadiing Message
                message.channel.send(embed);
              }, 5000);
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

/**
 * Command: !chuck
 * Params: None
 * Desc: Returns a random Chuck Norris joke.
 */
module.exports.generateRandomChuckNorrisJoke = (message) => {
  api.get(`http://api.icndb.com/jokes/random`)
    .then(response => {
      let joke = response.data.value.joke;
      message.channel.send(joke);
    })
    .catch(error => {
      console.log(`Chuck Norris Joke Get ERROR: ${error}`);
      message.reply("Chuck Norris found out we were making fun of him... I couldn't get a joke, m'kay");
    });
};

/**
 * Command: !list
 * Params: None
 * Desc: Returns a list of all the commands Mr.Mackey knows.
 */
module.exports.getListOfCommands = async (message, commands) => {
  // Append Custom Commands to `commands` array
  let allCustomCmds = await Custom.getListOfCustomCommands(message).catch(error => error);
  let customCmds = [];
  for(let i = 0; i < allCustomCmds.total_rows; i++) {
    let cmd = allCustomCmds.rows[i].doc._id,
        response = allCustomCmds.rows[i].doc.response;
    customCmds.push({
      command: cmd,
      description: response
    });
  }
  
  // Put isInline: true on all inline commands and concat any custom commands to the regular command list.
  let inlineCmds = commands.inline,
      normalCmds = commands.commands;
  for(let i = 0; i < inlineCmds.length; i++) { inlineCmds[i].isInline = true; } // We do this so we can omit the ! when displaying the command
  if(typeof customCmds !== "undefined" && Array.isArray(customCmds) && customCmds.length > 0) {
    normalCmds = normalCmds.concat(customCmds);

    // Sort normalCmds by command
    normalCmds.sort(( a, b ) => {
      if ( a.command < b.command ){
        return -1;
      }
      if ( a.command > b.command ){
        return 1;
      }
      return 0;
    });
  }

  // Concat the normal/custom commands to the end of the inline command list, we want inline commands first.
  let allCmds = inlineCmds.concat(normalCmds);

  // We can only do 25 RichEmbed fields, so we need to possible break up this into multiple RichEmbed sends.
  let numOfRichEmbeds = Math.ceil(allCmds.length / 25),
  curIndex = 0;

  for(let msgIndex = 0; msgIndex < numOfRichEmbeds; msgIndex++) {
    let embed = new RichEmbed();
        embed.setAuthor(`List of Commands Mr.Mackey Knows${(msgIndex > 0 ? " (Cont.)" : "")}:`);

    // Go through each command, add the first cmd to the field title, the second command to the field desc.
    // We will stop this loop if we hit the 25 field limit, or if we hit the end of the commands array.
    for(let i = 0; (i < 25 && curIndex < allCmds.length); i++) {
      let cmd = allCmds[curIndex++];
      embed.addField(`${(!cmd.isInline ? "!" : "")}${cmd.command}`, `${cmd.description}`);
    }

    message.author.send(embed);
    message.delete();
  }
};

/**
 * Command: !weather
 * Params:
 *  - [0] = Zipcode
 * Desc: Coverts zipcode into Lat/Long, then returns the forecast for the minute, hour and day.
*/
module.exports.getWeather = (message, params) => {
  if(Helpers.isParamSet(params)) {
    let zip = params[0];
    api.get(`https://www.zipcodeapi.com/rest/${auth.zipApiKey}/info.json/${zip}/degress`)
      .then((response) => {
        let lat = response.data.lat,
            lng = response.data.lng,
            cityNames = response.data.acceptable_city_names;

        let cityState = zip;
        if(cityNames && cityNames.length > 1) {
          cityState = `${cityNames[0].city}, ${cityNames[0].state}`;
        }
        
        // Now that we have the lat/lng, we can hit Dark Sky's API
        api.get(`https://api.darksky.net/forecast/${auth.darkSkyKey}/${lat},${lng}`)
          .then((response) => {
            let currently = `Currently, it is ${response.data.currently.temperature}°F.`,
                minutely = response.data.minutely.summary,
                hourly = response.data.hourly.summary,
                daily = response.data.daily.summary,
                embed = new RichEmbed();

            embed.setAuthor(`Weather for ${cityState}`);
            embed.setDescription(
              `${currently}

              ${minutely}
              
              ${hourly}
              
              ${daily}`
            );
            embed.setFooter('Powered by DarkSky', "https://darksky.net/images/darkskylogo.png");
            

            message.channel.send(embed);
          })
          .catch((error) => {
            // There was an error getting the darksky forecast information
            console.log(`Weather Forecast GET Error: ${error}`);
            message.reply("I couldn't get the forecast for that zipcode, m'kay...");
          });
      })
      .catch((error) => {
        // There was an error getting the Zipcode Location information
        console.log(`Weather Zip Location GET Error: ${error}`);
        message.reply("I couldn't get the zipcode information, m'kay.");
      });
  } else {
    message.reply("!weather command must include a zipcode... m'kay (Ex. !weather 80227)");
  }
}