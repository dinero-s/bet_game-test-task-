const { Client } = require('pg');

const gameDB = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'gameDB',
  password: 'example',
  port: 15432,
});

gameDB.connect()

module.exports = gameDB;
