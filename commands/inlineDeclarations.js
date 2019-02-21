let map = require("./inlineFunctions.js");

module.exports = [
  {
    command: "++",
    description: "@user++ | Increments the designated user's point value.",
    action: (msg) => { map.updateKarma(msg,"++"); }
  },
  {
    command: "--",
    description: "@user-- | Decrements the designated user's point value.",
    action: (msg) => { map.updateKarma(msg,"--"); }
  }
];