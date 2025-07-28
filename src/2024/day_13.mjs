import fs from 'node:fs';

class ClawMachine {
  constructor(data) {
    const [_buttonA, _buttonB, _prize] = data.split('\n');
    const parseData = (data) => data.match(/\d+/g).map(Number);
    this.buttonA = { token: 3, dx: parseData(_buttonA)[0], dy: parseData(_buttonA)[1] };
    this.buttonB = { token: 1, dx: parseData(_buttonB)[0], dy: parseData(_buttonB)[1] };
    this.prize = { x: parseData(_prize)[0], y: parseData(_prize)[1] };
  }

  cheapestPath({ maxButtonPresses } = {}) {
    /* Solves the 2x2 linear system:
     * (a * buttonA + b * buttonB) = prize
     * using Cramer's Rule.
     * buttonA and buttonB are 2D vectors; prize is a 2D point.
     * Computes determinant to solve for b, then backsolves for a.
     * https://openstax.org/books/college-algebra-2e/pages/7-8-solving-systems-with-cramers-rule
     */
    const bPresses = ((this.buttonA.dx * this.prize.y) - (this.buttonA.dy * this.prize.x)) / ((this.buttonA.dx * this.buttonB.dy) - (this.buttonB.dx * this.buttonA.dy));
    const aPresses = (this.prize.x - (bPresses * this.buttonB.dx)) / this.buttonA.dx;

    const fitsCleanly = Number.isInteger(aPresses) && Number.isInteger(bPresses);
    const isInLimitRange = !maxButtonPresses || (aPresses <= maxButtonPresses || bPresses <= maxButtonPresses);

    if (!fitsCleanly || !isInLimitRange) return null;
    return aPresses * this.buttonA.token + bPresses * this.buttonB.token;
  }
}

const arcade = fs.readFileSync('input.txt', 'utf-8').trim().split('\n\n').map(data => new ClawMachine(data));

const totalTokens = arcade.reduce((acc, cur) => acc + cur.cheapestPath({ maxButtonPresses: 100 }), 0);
console.log(`Part 1: ${totalTokens}`);

arcade.forEach(clawMachine => {
  clawMachine.prize.x += 10000000000000;
  clawMachine.prize.y += 10000000000000;
});

const totalTokens2 = arcade.reduce((acc, cur) => acc + cur.cheapestPath(), 0);
console.log(`Part 2: ${totalTokens2}`);
