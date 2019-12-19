let { RichEmbed } = require("discord.js");
let Helpers = require('../util/helpers.js');

module.exports.pickRandomOption = ( message ) => {
  let options = message.content.split("<>").map((option) => option.trim()).filter((option) => typeof option !== undefined && option !== null && option !== ''),
      numOfOptions = options.length;
      
  if(numOfOptions > 0) {
    let rand = Helpers.getRandomInt(1,numOfOptions) - 1,
        pick = options[rand];
        message.reply(pick);
  } else {
    message.reply("I did not see any options to pick from... m'kay");
  }
};