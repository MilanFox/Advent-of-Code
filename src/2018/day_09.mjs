import { readFileSync } from 'node:fs';

class MarbleGame {
  constructor(numberOfPlayers, lastMarbleScore) {
    this.lastMarbleScore = lastMarbleScore;
    this.marbles = new Map();
    this.nextMarbleScore = 1;

    this.marbles.set(0, new Marble(0));

    this.currentID = 0;

    this.currentPlayerID = -1;
    this.players = Array.from({ length: numberOfPlayers }, () => 0);
  }

  get currentMarble() {
    return this.marbles.get(this.currentID);
  }

  get debugCheckSum() {
    let current = 0;
    const order = [];
    while (order.length < this.marbles.size) {
      const currentMarble = this.marbles.get(current);
      order.push(currentMarble.value);
      current = currentMarble.next.value;
    }
    return order.join('-');
  }

  placeNextMarble() {
    if ((this.nextMarbleScore % 23) !== 0) {
      const prevMarble = this.currentMarble.next;
      const nextMarble = this.currentMarble.next.next;

      this.currentID = this.nextMarbleScore;

      const newMarble = new Marble(this.nextMarbleScore, prevMarble, nextMarble);

      this.marbles.set(this.nextMarbleScore, newMarble);

      prevMarble.next = newMarble;
      nextMarble.prev = newMarble;
    } else {
      this.players[this.currentPlayerID] += this.currentID + 1;
      const marbleRightOfDeletion = this.currentMarble.prev.prev.prev.prev.prev.prev;
      this.players[this.currentPlayerID] += marbleRightOfDeletion.prev.value;

      const marbleLeftOfDeletion = marbleRightOfDeletion.prev.prev;
      marbleLeftOfDeletion.next = marbleRightOfDeletion;
      marbleRightOfDeletion.prev = marbleLeftOfDeletion;

      this.currentID = marbleRightOfDeletion.value;
    }

    this.currentPlayerID = (this.currentPlayerID + 1) % (this.players.length);
    this.nextMarbleScore += 1;
  }

  runGame() {
    for (let i = 0; i < this.lastMarbleScore; i++) {
      this.placeNextMarble();
    }
  }

  get highScore() {
    return this.players.reduce((acc, cur) => Math.max(acc, cur), 0);
  }
}

class Marble {
  constructor(id, prev = this, next = this) {
    this.value = id;
    this.prev = prev;
    this.next = next;
  }
}

const [numberOfPlayers, lastMarbleScore] =
  /(\d+) players; last marble is worth (\d+) points/
    .exec(readFileSync('input.txt', 'utf-8').trim())
    .slice(1)
    .map(Number);

const marbleGame = new MarbleGame(numberOfPlayers, lastMarbleScore);
marbleGame.runGame();
console.log(`Part 1: ${marbleGame.highScore}`);
