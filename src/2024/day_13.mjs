import fs from 'node:fs';

class ClawMachine {
  constructor(data) {
    const [_buttonA, _buttonB, _prize] = data.split('\n');
    const parseData = (data) => data.match(/\d+/g).map(Number);
    this.buttonA = { token: 3, dx: parseData(_buttonA)[0], dy: parseData(_buttonA)[1] };
    this.buttonB = { token: 1, dx: parseData(_buttonB)[0], dy: parseData(_buttonB)[1] };
    this.prize = { x: parseData(_prize)[0], y: parseData(_prize)[1] };
  }

  get cheapestPath() {
    const maxButtonPresses = 100;

    const initialBAssumption = Math.min(
      Math.floor(this.prize.x / this.buttonB.dx),
      Math.floor(this.prize.y / this.buttonB.dy),
      maxButtonPresses,
    );

    const bInputs = {
      presses: initialBAssumption,
      x: initialBAssumption * this.buttonB.dx,
      y: initialBAssumption * this.buttonB.dy,
    };

    for (let b = bInputs.presses; b >= 0; b--) {
      const remainingX = this.prize.x - bInputs.x;
      const remainingY = this.prize.y - bInputs.y;

      if (remainingX % this.buttonA.dx === 0 && remainingY % this.buttonA.dy === 0) {
        const aStepsX = remainingX / this.buttonA.dx;
        const aStepsY = remainingY / this.buttonA.dy;

        if (aStepsX === aStepsY) {
          return bInputs.presses * this.buttonB.token + aStepsX * this.buttonA.token;
        }
      }

      bInputs.presses -= 1;
      bInputs.x -= this.buttonB.dx;
      bInputs.y -= this.buttonB.dy;
    }

    return null;
  }
}

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n\n').map(data => new ClawMachine(data));

const totalTokens = inputData.reduce((acc, cur) => acc + cur.cheapestPath, 0);
console.log(`Part 1: ${totalTokens}`);
