let { RichEmbed } = require("discord.js");
let Helpers = require('../util/helpers.js');

let PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

let dbAuth = require('../util/database.js');
let dbName = "games";

String.prototype.hashCodeString = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash+"";
}

const getAllGames = () => dbAuth(dbName).allDocs({ include_docs: true });

let replyRandomGame = (message) => {
  getAllGames()
    .then(gamesList => {
      if(gamesList.total_rows <= 0) {
        // No games in list
        message.reply("No games have been add yet... m'kay (!game add {Name of Game})");
        return;
      }
  
      let games = gamesList.rows;
      if(gamesList.total_rows > 1) {
        games.sort((a,b) => {
          if(a.doc.name > b.doc.name) return 1;
          else return -1;
        });
      }
  
      const gameIndex = Math.floor(Math.random() * games.length);
      message.reply(`You should play ${games[gameIndex].doc.name}, m'kay...`);
    });
}

let listAllGames = (message) => {
  getAllGames()
    .then(gamesList => {
      if(gamesList.total_rows <= 0) {
        // No games in list
        message.reply("No games have been add yet... m'kay (!game add {Name of Game})");
        return;
      }

      let games = gamesList.rows;
      if(gamesList.total_rows > 1) {
        games.sort((a,b) => {
          if(a.doc.name > b.doc.name) return 1;
          else return -1;
        });
      }

      let embed = new RichEmbed();
      embed.setAuthor(`Games Mr.Mackey Knows:`);

      if(gamesList.total_rows % 2 !== 0) {
        let game = games.shift();
        embed.setDescription(`${game.doc.name}`);
      }

      for(let i = 0; i < games.length; i++) {
        embed.addField(`${games[i].doc.name}`, `${games[++i].doc.name}`);
      }

      message.channel.send(embed);
    });
}

let addNewGame = (message, game) => {
  let db = dbAuth(dbName),
      plainGameName = game.toLowerCase().replace(/ /g,''),
      gameHash = plainGameName.hashCodeString();

  let dupeGame = true;
  db.get(gameHash)
    .catch(error => {
      // If not found, perfect, add it to the db.
      if (error.name === 'not_found') {
        dupeGame = false;
        return {
          _id: gameHash,
          name: game
        };
      } else { // hm, some other error
        throw error;
      }
    })
    .then(doc => {
      db.put(doc)
        .then(updatedDoc => {
          let replyMsg = (dupeGame ? `${game} is already in the list... m'kay` : `${game} added to the list... m'kay`);
          message.reply(replyMsg);
        })
        .catch(error => {
          console.log(`Game Adding: ${error}`);
          message.reply(`Couldn't add ${game} as a new game... m'kay`);
        });
    });
}

/**
 * Command: !game
 * Params:
 *  - [0] = add/remove/list
 *  - [1] = Name of Game (Required if [0] is add or remove.)
 * Desc: If no params, we will pick a random game. Add/Remove will modify the list of games. List will display the list of games.
 */
module.exports.letsGame = function(message, params) {
  if(Helpers.isParamSet(params)) {
    switch(params.shift()) {
      case "add":
        addNewGame(message, params.join(" "));
        break;
      case "remove":
        message.reply("Cow was lazy and didn't want to make this part yet... m'kay");
        break;
      case "list":
        listAllGames(message);
        break;
      default:
        message.reply("Not sure what you're wanting me to do, m'kay... (!game {add|remove|list} | !game -> returns random game)");
        break;
    }
  } else {
    replyRandomGame(message);
  }
}