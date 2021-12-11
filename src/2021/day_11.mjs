import * as fs from 'node:fs';

class Octopus {
  constructor({ energyLevel, x, y }) {
    this.energyLevel = parseInt(energyLevel);
    this.x = x;
    this.y = y;
    this.hasFlashed = false;
    this.flashes = 0;
  }

  findNeighbors(grid) {
    const neighbors = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    this.neighbors = neighbors.map(([Y, X]) => grid[this.y + Y]?.[this.x + X]).filter(Boolean);
  }

  increaseLevel({ shouldPropagate }) {
    this.energyLevel += 1;
    if (shouldPropagate) this.tryPropagatePulse();
  }

  newRound() {
    if (this.hasFlashed) this.energyLevel = 0;
    this.hasFlashed = false;
    this.increaseLevel({ shouldPropagate: false });
  }

  tryPropagatePulse() {
    if (this.energyLevel > 9 && !this.hasFlashed) {
      this.hasFlashed = true;
      this.flashes += 1;
      this.neighbors.forEach(octopus => octopus.increaseLevel({ shouldPropagate: true }));
    }
  }

}

const grid = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map((row, y) => row.split('').map((energyLevel, x) => new Octopus(({ energyLevel, x, y }))));

const octopusList = grid.flat();
octopusList.forEach(octopus => octopus.findNeighbors(grid));

let i = 0;

while (true) {
  if (i === 100) console.log(`Part 1: ${octopusList.reduce((acc, cur) => acc + cur.flashes, 0)}`);
  octopusList.forEach(octopus => octopus.newRound());
  octopusList.forEach(octopus => octopus.tryPropagatePulse());
  i += 1;
  if (octopusList.every(octopus => octopus.hasFlashed)) break;
}

console.log(`Part 2: ${i}`);
