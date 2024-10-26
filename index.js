const db = require('./db');
const cron = require('node-cron');

const Game = require('./game');

db.query(`
DROP TABLE game CASCADE;
DROP TABLE gamer CASCADE;
`)

db.query(`
  CREATE TABLE game (
  id SERIAL PRIMARY KEY,
  bet NUMERIC(10, 2),
  profit NUMERIC(10, 2),
  balance NUMERIC(10, 2),
  bet_time TIMESTAMP WITH TIME ZONE
  )
 `)

db.query(`
  CREATE TABLE gamer (
  id SERIAL PRIMARY KEY,
  state VARCHAR(20),
  balance NUMERIC(10, 2),
  bet_time TIMESTAMP WITH TIME ZONE
  )
 `)
Game.betGame()
function timer() {
  Game.betGame()
}


const cronStop = cron.schedule('*/15 * * * * *', () => {
  timer()
});


