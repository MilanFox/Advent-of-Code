import fs from 'node:fs';

class GardenPlot {
  #cells;

  constructor(cells) {
    this.#cells = cells;
    this.size = this.#cells.length;
    this.type = garden[cells[0].y][cells[0].x];
    this.perimeter = getPerimeter(this);
  }

  get cells() { return this.#cells; }
  get price() { return this.size * this.perimeter;}
}

const garden = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(row => row.split(''));

const visited = new Set();
const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const isInBounds = ({ X, Y }) => Y >= 0 && Y < garden.length && X >= 0 && X < garden[0].length;

const mapOutPlot = (startingPos) => {
  const gardenCells = [];
  const queue = [startingPos];
  const plotType = garden[startingPos.y][startingPos.x];

  while (queue.length) {
    const { x, y } = queue.shift();
    const hash = `${x}|${y}`;

    if (visited.has(hash) || garden[y][x] !== plotType) continue;

    visited.add(hash);
    gardenCells.push({ x, y });

    for (const [offsetX, offsetY] of directions) {
      const X = x + offsetX;
      const Y = y + offsetY;
      if (isInBounds({ X, Y })) queue.push({ x: X, y: Y });
    }
  }
  return new GardenPlot(gardenCells);
};

const getAllPlots = () => {
  const gardenPlots = [];
  for (let y = 0; y < garden.length; y++) {
    for (let x = 0; x < garden[y].length; x++) {
      const hash = `${x}|${y}`;
      if (!visited.has(hash)) gardenPlots.push(mapOutPlot({ x, y }));
    }
  }
  return gardenPlots;
};

const getPerimeter = ({ cells }) => {
  let perimeter = 0;
  for (const { x, y } of cells) {
    let fence = 4;
    for (const [offsetX, offsetY] of directions) {
      const X = x + offsetX;
      const Y = y + offsetY;
      if (cells.find(cell => cell.y === Y && cell.x === X)) fence--;
    }
    perimeter += fence;
  }
  return perimeter;
};

const gardenPlots = getAllPlots();
const totalPrice = gardenPlots.reduce((acc, cur) => acc + cur.price, 0);

console.log(`Part 1: ${totalPrice}`);
