let map = require("./inlineFunctions.js");

module.exports = [
  {
    command: "++",
    description: "@user++ | Increments the designated user's point value.",
    action: (msg,params) => { map.incrementPoints(msg,params); }
  },
  {
    command: "--",
    description: "@user-- | Decrements the designated user's point value.",
    action: (msg,params) => { map.decrementPoints(msg,params); }
  }
];