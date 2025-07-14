import { readFileSync } from 'node:fs';

class Hologram {
  constructor(length) {
    this.cells = Array.from({ length }, (_, y) =>
      Array.from({ length }, (_, x) =>
        new FuelCell({ x: x + 1, y: y + 1, hologram: this }),
      ),
    );

    const windowSize = 3;
    for (let y = 1; y < this.cells.length - (windowSize - 1); y++) {
      for (let x = 1; x < this.cells[0].length - (windowSize - 1); x++) {
        const offset = Array.from({ length: windowSize }, (_, i) => i);
        this.cells[y][x].totalPowerLevel = offset.reduce((total, curY) =>
          total + offset.reduce((local, curX) =>
          local + this.cells[y + curY][x + curX].powerlevel, 0), 0);
      }
    }
  }

  get largestTotalPowerLevel() {
    const largestTotal = this.cells.flat().toSorted((a, b) => b.totalPowerLevel - a.totalPowerLevel).at(0);
    return `${largestTotal.x},${largestTotal.y}`;
  }
}

class FuelCell {
  constructor({ x, y, hologram }) {
    this.x = x;
    this.y = y;
    this.#hologram = hologram;
    const rackId = x + 10;
    this.powerlevel = Math.floor(((((rackId * y) + serialNumber) * rackId) / 100) % 10) - 5;
    this.totalPowerLevel = -Infinity;
  }

  #hologram;
}

const serialNumber = Number(readFileSync('input.txt', 'utf-8').trim());

const hologram = new Hologram(300);

console.log(`Part 1: ${hologram.largestTotalPowerLevel}`);
