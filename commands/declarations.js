let map = require("./functions.js");
let Custom = require('./customFunctions.js');
let Karma = require("./karmaFunctions.js");

module.exports = [
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
    command: "scoreboard",
    description: "Post the karma leaderboard.",
    action: (msg) => { Karma.getScoreboard(msg); },
    hasParams: false
  },
  {
    command: "karma-log",
    description: "List the log of karma changes for yourself, or whoever you mention. (Ex. !karmaLog @Coworado 2 or simply !karmaLog)",
    action: (msg,params) => { Karma.getKarmaLog(msg,params); },
    hasParams: true
  },
  {
    command: "xkcd",
    description: "Returns a random xkcd comic.",
    action: (msg) => { map.getRandomXkcd(msg); },
    hasParams: false
  },
  {
    command: "twitter",
    description: "Returns a link for each most recent tweet found. (Ex. !twitter realDonaldTrump {numOfTweets (Optional | Max: 5)})",
    action: (msg,params) => { map.getTweetsByScreenName(msg,params); },
    hasParams: true
  },
  {
    command: "trump",
    description: "Returns a link for each most recent tweet from @realDonaldTrump. (Ex. !trump {numOfTweets (Optional | Max: 5)})",
    action: (msg,params) => { map.getTweetsFromTrump(msg,params); },
    hasParams: true
  },
  {
    command: "ram",
    description: "Returns a gif from a Rick and Morth scene that includes your search term. (Ex. !ram squanchy)",
    action: (msg,params) => { map.getMatchingRickAndMortyScene(msg,params); },
    hasParams: true
  },
  {
    command: "drugs",
    description: "Classic Mr.Mackey.",
    action: (msg) => { map.drugsAreBad(msg); },
    hasParams: false
  },
  {
    command: "pizza",
    description: "What time is it?",
    action: (msg) => { map.pizzaTime(msg); },
    hasParams: false
  }
];