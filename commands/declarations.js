let map = require("./functions.js");

module.exports = [
  {
    command: "drugs",
    description: "Classic Mr.Mackey",
    action: (msg) => { map.drugsAreBad(msg); },
    hasParams: false
  },
  {
    command: "pizza",
    description: "Returns a gif of 'Pizza Time' Peter Parker",
    action: (msg) => { map.pizzaTime(msg); },
    hasParams: false
  },
  {
    command: "xkcd",
    description: "Returns a random xkcd comic",
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
    command: "list",
    description: "Returns a list of all the commands Mr.Mackey knows",
    action: (msg,cmds) => { map.getListOfCommands(msg,cmds); },
    hasParams: false
  }
];