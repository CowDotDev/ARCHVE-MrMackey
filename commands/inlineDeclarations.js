let Karma = require("./karmaFunctions.js"),
    Inline = require('./inlineFunctions.js');

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
  },
  {
    command: "<>",
    description: "Option 1 <> Option 2 <> Option 3 ... etc. | Will take a list of options, and pick one randomly.",
    action: (msg) => { Inline.pickRandomOption(msg); }
  }
];