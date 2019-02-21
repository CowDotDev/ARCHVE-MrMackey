let negativeResponses = require('./negativeResponses.js');
let positiveResponses = require('./positiveResponses.js');

module.exports.generateNegativeKarmaResponse = () => {
  let max = negativeResponses.length,
      index = Math.floor(Math.random() * max);
  return negativeResponses[index];
}

module.exports.generatePositiveKarmaResponse = () => {
  let max = positiveResponses.length,
      index = Math.floor(Math.random() * max);
  return positiveResponses[index];
}