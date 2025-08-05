import { readFileSync } from 'node:fs';

const dirMap = ['^', '>', 'v', '<'];

const connectionMap = {
  '-': [null, [1, 0], null, [-1, 0]],
  '>': [null, [1, 0], null, [-1, 0]],
  '<': [null, [1, 0], null, [-1, 0]],
  '|': [[0, -1], null, [0, 1], null],
  '^': [[0, -1], null, [0, 1], null],
  'v': [[0, -1], null, [0, 1], null],
  '/': [[0, -1], [1, 0], [0, 1], [-1, 0]],
  '\\': [[0, -1], [1, 0], [0, 1], [-1, 0]],
  '+': [[0, -1], [1, 0], [0, 1], [-1, 0]],
};

class Cart {
  constructor(rail, dir) {
    this.rail = rail;
    this.dir = dirMap.findIndex(el => el === dir);
  }

  #decisions = [-1, 0, 1];
  #decisionSeed = 0;

  moveTick() {
    let pivot;

    if (this.rail.isIntersection) {
      pivot = this.#decisions[this.#decisionSeed];
      this.#decisionSeed = (this.#decisionSeed + 1) % 3;
    } else {
      pivot = [0, -1, 1].find(dir => this.rail.neighbours[((this.dir + dir % 4) + 4) % 4]);
    }

    this.dir = ((this.dir + pivot % 4) + 4) % 4;
    this.rail = this.rail.neighbours[this.dir];
  }
}

class Rail {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  neighbours = Array(4).fill(null);

  addNeighbour(rail, dir) {
    this.neighbours[dir] = rail;
  }

  #isIntersection = undefined;
  get isIntersection() {
    if (!this.#isIntersection) this.#isIntersection = this.neighbours.every(rail => rail !== null);
    return (this.#isIntersection);
  }
}

class Track {
  constructor(data) {
    data.forEach((line, y) => {
      this.tracks[y] = [];
      line.forEach((cell, x) => {
        if (cell === undefined || cell === ' ') return;

        const curRail = new Rail(x, y, cell);
        if (dirMap.includes(cell)) this.carts.push(new Cart(curRail, cell));

        this.tracks[y][x] = curRail;

        connectionMap[cell].forEach((connection, i) => {
          if (!connection) return;
          const [dx, dy] = connection;

          if (this.tracks[y + dy]?.[x + dx]) {
            const neighborRail = this.tracks[y + dy][x + dx];
            curRail.addNeighbour(neighborRail, i);
            neighborRail.addNeighbour(curRail, (i + 2) % 4);
          }
        });
      });
    });
  }

  tracks = [];
  carts = [];
}

const mine = new Track(readFileSync('testInput.txt', 'utf-8').trim().split('\n').map(line => line.split('')));

for (let i = 0; i < 20; i++) {
  console.log(`y: ${mine.carts[1].rail.y}, x: ${mine.carts[1].rail.x}, dir: ${mine.carts[1].dir}`);
  mine.carts[1].moveTick();
}

