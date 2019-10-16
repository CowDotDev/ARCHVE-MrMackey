let Karma = require("./karmaFunctions.js");

module.exports = [
  {
    command: "++",
    description: "@user++ | Increments the designated user's point value.",
    action: (msg) => { Karma.updateKarma(msg,"++"); }
  },
  {
    command: "--",
    description: "@user-- | Decrements the designated user's point value.",
    action: (msg) => { Karma.updateKarma(msg,"--"); }
  },
  {
    command: "—",
    description: "@user-- | Decrements the designated user's point value.",
    action: (msg) => { Karma.updateKarma(msg,"--"); }
  }
];