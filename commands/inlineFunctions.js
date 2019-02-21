let { RichEmbed } = require("discord.js");
let Karma = require("./karmaFunctions.js");

module.exports.updateKarma = (message,fate) => {
  Karma.updateKarma(message,fate);
};