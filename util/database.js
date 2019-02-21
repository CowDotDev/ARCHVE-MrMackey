let auth = require('../auth.json');
let PouchDB = require('pouchdb');
let dbUrl = `http://${auth.dbUsername}:${auth.dbPassword}@localhost:5984/`;

module.exports = (dbName) => {
  return new PouchDB(`${dbUrl}${dbName}`);
}