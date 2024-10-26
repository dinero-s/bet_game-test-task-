const db = require('./db');
const Game = require('./game');
const readline = require('readline').createInterface({
  input: process.stdin
});

class Gamer {
  static randomNumber = 0;
  static cardValue = 0;
  static card_1 = '';
  static card_2 = '';
  static gameBalance = 100;

  constructor() {
  }

  static skipBet() {
    this.doBet()
  }

  static gamerBetStore(state, balance) {
     db.query('INSERT INTO gamer (state, balance, bet_time) VALUES ($1, $2, $3)',
      [state, balance, new Date()])
  }
}

module.exports = Gamer