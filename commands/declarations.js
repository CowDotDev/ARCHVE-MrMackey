let map = require("./functions.js");
let Custom = require('./customFunctions.js');
let Karma = require("./karmaFunctions.js");
let Games = require("./gameFunctions.js");

module.exports = [
  {
    command: "chuck",
    description: "Returns a random Chuck Norris joke.",
    action: (msg) => { map.generateRandomChuckNorrisJoke(msg); },
    hasParams: false
  },
  {
    command: "drugs",
    description: "Classic Mr.Mackey.",
    action: (msg) => { map.drugsAreBad(msg); },
    hasParams: false
  },
  {
    command: "game",
    description: "We're children and can't make up our minds, so Mr.Mackey will do it for us. (Ex. !game -> random game | !game list -> list games | !game add Halo 5 -> Adds Halo 5 to the List | !game remove Halo 5 -> Removes Halo 5 from List)",
    action: (msg,params) => { Games.letsGame(msg,params); },
    hasParams: true
  },
  {
    command: "karma-log",
    description: "List the log of karma changes for yourself, or whoever you mention. (Ex. !karmaLog @Coworado 2 or simply !karmaLog)",
    action: (msg,params) => { Karma.getKarmaLog(msg,params); },
    hasParams: true
  },
  {
    command: "list",
    description: "Returns a list of all the commands Mr.Mackey knows.",
    action: (msg,cmds) => { map.getListOfCommands(msg,cmds); },
    hasParams: false
  },
  {
    command: "on",
    description: "Allows a user to create or update custom commands. (Ex. !on cow moo moo -> !cow -> moo moo)",
    action: (msg,params) => { Custom.createCustomCommand(msg,params); },
    hasParams: true
  },
  {
    command: "pizza",
    description: "What time is it?",
    action: (msg) => { map.pizzaTime(msg); },
    hasParams: false
  },
  {
    command: "ram",
    description: "Returns a gif from a Rick and Morth scene that includes your search term. (Ex. !ram squanchy)",
    action: (msg,params) => { map.getMatchingRickAndMortyScene(msg,params); },
    hasParams: true
  },
  {
    command: "scoreboard",
    description: "Post the karma leaderboard.",
    action: (msg) => { Karma.getScoreboard(msg); },
    hasParams: false
  },
  {
    command: "trump",
    description: "Returns a link for each most recent tweet from @realDonaldTrump. (Ex. !trump {numOfTweets (Optional | Max: 5)})",
    action: (msg,params) => { map.getTweetsFromTrump(msg,params); },
    hasParams: true
  },
  {
    command: "twitter",
    description: "Returns a link for each most recent tweet found. (Ex. !twitter realDonaldTrump {numOfTweets (Optional | Max: 5)})",
    action: (msg,params) => { map.getTweetsByScreenName(msg,params); },
    hasParams: true
  },
  {
    command: "urban",
    description: "Return the top 3 definitions of a word/phrase from urban dictionary. (Ex. !urban jebaited)",
    action: (msg,params) => { map.getUrbanDefinition(msg,params); },
    hasParams: true
  },
  // {
  //   command: "weather",
  //   description: "Get the weather for a zipcode. (Ex. !weather 80227)",
  //   action: (msg,params) => { map.getWeather(msg,params); },
  //   hasParams: true
  // },
  {
    command: "xkcd",
    description: "Returns a random xkcd comic.",
    action: (msg) => { map.getRandomXkcd(msg); },
    hasParams: false
  }
];