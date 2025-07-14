import { readFileSync } from 'node:fs';

class Hologram {
  constructor(length) {
    this.cells = Array.from({ length }, (_, y) =>
      Array.from({ length }, (_, x) =>
        new FuelCell({ x: x + 1, y: y + 1, hologram: this }),
      ),
    );

    for (let y = 0; y < this.cells.length; y++) {
      for (let x = 0; x < this.cells.length; x++) {
        const prevHorizontalSum = this.cells[y][x - 1]?.summedArea ?? 0;
        const prevVerticalSum = this.cells[y - 1]?.[x].summedArea ?? 0;
        const doubleAccountedSum = this.cells[y - 1]?.[x - 1]?.summedArea ?? 0;
        this.cells[y][x].summedArea = prevHorizontalSum + prevVerticalSum - doubleAccountedSum + this.cells[y][x].powerlevel;
      }
    }

    for (let windowSize = 1; windowSize <= this.cells.length; windowSize++) {
      for (let y = 0; y < this.cells.length - windowSize + 1; y++) {
        for (let x = 0; x < this.cells.length - windowSize + 1; x++) {
          const y2 = y + windowSize - 1;
          const x2 = x + windowSize - 1;
          const topStrip = this.cells[y - 1]?.[x2]?.summedArea ?? 0;
          const leftStrip = this.cells[y2]?.[x - 1]?.summedArea ?? 0;
          const doubleAccountedSum = this.cells[y - 1]?.[x - 1]?.summedArea ?? 0;
          const totalAtWindowSize = this.cells[y2][x2].summedArea - topStrip - leftStrip + doubleAccountedSum;
          this.cells[y][x].totalPowerLevel[windowSize] = totalAtWindowSize;
        }
      }
    }
  }

  largestTotalPowerLevelAt(windowSize) {
    return this
      .cells
      .flat()
      .map(cell => [cell.totalPowerLevel[windowSize], cell])
      .filter(([powerLevel]) => powerLevel)
      .toSorted((a, b) => b.at(0) - a.at(0))
      .at(0)
      .at(1);
  }

  get largestTotalPowerLevel() {
    return Array
      .from({ length: this.cells.length }, (_, i) => this.cells.slice(0, this.cells.length - i).map((row => row.slice(0, this.cells.length - i))).flat())
      .map((row, i) => row.reduce(([highest], cur) => {
        if (!highest || cur.totalPowerLevel[i + 1] > highest.totalPowerLevel[i + 1]) return [cur, i + 1];
        return [highest, i + 1];
      }, []))
      .toSorted(([a, ai], [b, bi]) => b.totalPowerLevel[bi] - a.totalPowerLevel[ai])
      .at(0);
  }
}

class FuelCell {
  constructor({ x, y, hologram }) {
    this.x = x;
    this.y = y;
    this.#hologram = hologram;
    const rackId = x + 10;
    this.powerlevel = Math.floor(((((rackId * y) + serialNumber) * rackId) / 100) % 10) - 5;
    this.totalPowerLevel = {};
  };

  summedArea;
  #hologram;
}

const serialNumber = Number(readFileSync('input.txt', 'utf-8').trim());

const hologram = new Hologram(300);

const largestSmallWindow = hologram.largestTotalPowerLevelAt(3);
console.log(`Part 1: ${largestSmallWindow.x},${largestSmallWindow.y}`);

const largestFlexibleWindow = hologram.largestTotalPowerLevel;
console.log(`Part 2: ${largestFlexibleWindow[0].x},${largestFlexibleWindow[0].y},${largestFlexibleWindow[1]}`);
