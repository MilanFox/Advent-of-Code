import * as fs from 'node:fs';

class Player {
  constructor(data) {
    const [player, ...cards] = data.split('\n').map(n => parseInt(n) || n);
    this.player = player.slice(0, -1);
    this.hand = cards;
  }

  draw() {
    return this.hand.shift();
  }

  take(round) {
    round.forEach(player => this.hand.push(player.card));
  }

  get hasCards() {
    return Boolean(this.hand.length);
  }

  get score() {
    return this.hand.toReversed().reduce((acc, cur, i) => acc + (cur * (i + 1)), 0);
  }
}

const players = fs.readFileSync('input.txt', 'utf-8').trim().split('\n\n').map(data => new Player(data));

while (players.every(player => player.hasCards)) {
  const round = players.map(player => ({ player, card: player.draw() })).sort((a, b) => b.card - a.card);
  round[0].player.take(round);
}

console.log(`Part 1: ${players.find(player => player.hasCards).score}`);
