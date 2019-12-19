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

module.exports.isParamSet = (params) => (typeof params !== "undefined" && Array.isArray(params) && params.length > 0);

module.exports.getRandomInt = (min,max) => Math.floor(Math.random() * (max - min + 1) + min);
