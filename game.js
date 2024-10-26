const db = require('./db');
const readline = require('readline').createInterface({
  input: process.stdin
});
const Gamer = require("./gamer");

class Game {
  static shoes = {}
  static randomNumber = 0;
  static cardValue = 0;
  static card_1 = '';
  static card_2 = '';

  constructor() {
  }

  static cards() {
    const suits = ['♠️', '♥️', '♦️', '♣️'];
    const ranks = ['Туз', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Валет', 'Дама', 'Король'];
    const values = {
      'Туз': 11,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '8': 8,
      '9': 9,
      '10': 10,
      'Валет': 10,
      'Дама': 10,
      'Король': 10
    };

    for (let i = 1; i <= 6; i++) {
      for (let suit of suits) {
        for (let rank of ranks) {
          const key = rank + " " + suit; // Используем конкатенацию
          const value = values[rank]; // Берем значение из values для всех карт
          this.shoes[key] = value; // Записываем в объект Game.shoes
        }
      }
    }
  }

  static randomCard() {
    this.randomNumber = Math.floor(Math.random() * Object.keys(this.shoes).length)
    this.cardValue = Object.values(this.shoes)[this.randomNumber];
  }

  static betGame() {
    this.startNewRound();
  }

  static startNewRound() {
    this.cards();
    this.randomCard();
    this.card_1 = Object.keys(this.shoes)[this.cardValue];
    const shoeValue1 = this.shoes[this.card_1]
    console.log(`Первая карта - ${this.card_1}`, shoeValue1);

    console.log(`Раунд длится 15 секунд.`);
    console.log(`Сделайте ставку от 10 до ${Gamer.gameBalance}`);
    console.log(`Или нажмите 'x',чтоб пропустить ставку`);


    readline.question('Введите ставку или нажмите \'x\' чтоб пропустить', (input1) => {
      const bet = parseInt(input1);
      if (input1 === 'x') {
        Gamer.gamerBetStore("none", Gamer.gameBalance)
        this.startNewRound();
      } else if (bet >= 10 && bet <= Gamer.gameBalance) {
        const win = bet * 1.7;
        const lose = bet * 0.7;
        console.log('Угадайте, будет ли последующая карта больше (введите 1), либо меньше (введите 0)');
        readline.question('Введите 1 или 0: ', (input2) => {
          this.randomCard();
          this.card_2 = Object.keys(this.shoes)[this.cardValue];
          const shoeValue2 = this.shoes[this.card_2]
          if (input2 === '0' || input2 === '1') {
            if (input2 === '0') {
              if (shoeValue1 < shoeValue2) {
                console.log(`${this.card_2} - Вы проиграли!`);
                console.log(`Ваш баланс ${Gamer.gameBalance}`);
                Gamer.gamerBetStore("done", Gamer.gameBalance)
                setTimeout(() => {
                  Gamer.gameBalance = Gamer.gameBalance - (bet - lose);
                  this.gameBetStore(bet, -lose, Gamer.gameBalance);
                  this.startNewRound();
                }, 1000);
              } else if (shoeValue1 > shoeValue2) {
                console.log(`${this.card_2} - Вы выиграли!`);
                console.log(`Ваш баланс ${Gamer.gameBalance}`);
                Gamer.gamerBetStore("done", Gamer.gameBalance)
                setTimeout(() => {
                  Gamer.gameBalance = Gamer.gameBalance + (win - bet);
                  this.gameBetStore(bet, win, Gamer.gameBalance);
                  this.startNewRound();
                }, 1000);
              }
            } else if (input2 === '1') {
              if (shoeValue1 > shoeValue2) {
                console.log(`${this.card_2} - Вы проиграли!`);
                console.log(`Ваш баланс ${Gamer.gameBalance}`);
                Gamer.gamerBetStore("done", Gamer.gameBalance)
                setTimeout(() => {
                  Gamer.gameBalance = Gamer.gameBalance - (bet - lose);
                  this.gameBetStore(bet, -lose, Gamer.gameBalance);
                }, 1000);
                this.startNewRound();
              } else if (shoeValue1 < shoeValue2) {
                console.log(`${this.card_2} - Вы выиграли!`);
                console.log(`Ваш баланс ${Gamer.gameBalance}`);
                Gamer.gamerBetStore("done", Gamer.gameBalance)
                setTimeout(() => {
                  Gamer.gameBalance = Gamer.gameBalance + (win - bet);
                  this.gameBetStore(bet, win, Gamer.gameBalance);
                }, 1000);
                this.startNewRound();
              }
            } else if (shoeValue1 === shoeValue2) {
              console.log(`${this.card_2} - Ничья!`);
              Gamer.gamerBetStore("done", Gamer.gameBalance)
              setTimeout(() => {
                this.gameBetStore(bet, win, Gamer.gameBalance);
              }, 1000);
              this.startNewRound();
            }
          } else {
            console.log('Неверный ввод. Пожалуйста, введите 0 или 1.');
            this.startNewRound();
          }
        });
      } else {
        console.log(`Неверная ставка. Пожалуйста, введите ставку от 10 до, ${Gamer.gameBalance}`);
        this.startNewRound();
      }
    })
  }

  static async gameBetStore(bet, profit, balance) {
    await db.query('INSERT INTO game (bet, profit, balance, bet_time) VALUES ($1, $2, $3, $4)',
      [bet, profit, balance, new Date()])
  }
}


module.exports = Game