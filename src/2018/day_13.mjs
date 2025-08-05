import { readFileSync } from 'node:fs';

const dirMap = ['^', '>', 'v', '<'];

const connectionMap = {
  '-': [null, { dx: 1, dy: 0 }, null, { dx: -1, dy: 0 }],
  '>': [null, { dx: 1, dy: 0 }, null, { dx: -1, dy: 0 }],
  '<': [null, { dx: 1, dy: 0 }, null, { dx: -1, dy: 0 }],
  '|': [{ dx: 0, dy: -1 }, null, { dx: 0, dy: 1 }, null],
  '^': [{ dx: 0, dy: -1 }, null, { dx: 0, dy: 1 }, null],
  'v': [{ dx: 0, dy: -1 }, null, { dx: 0, dy: 1 }, null],
  '/': [
    { dx: 0, dy: -1, whiteList: ['|', 'v', '^', '+'] },
    { dx: 1, dy: 0, whiteList: ['-', '<', '>', '+'] },
    { dx: 0, dy: 1, whiteList: ['|', 'v', '^', '+'] },
    { dx: -1, dy: 0, whiteList: ['-', '<', '>', '+'] },
  ],
  '\\': [
    { dx: 0, dy: -1, whiteList: ['|', 'v', '^', '+'] },
    { dx: 1, dy: 0, whiteList: ['-', '<', '>', '+'] },
    { dx: 0, dy: 1, whiteList: ['|', 'v', '^', '+'] },
    { dx: -1, dy: 0, whiteList: ['-', '<', '>', '+'] },
  ],
  '+': [{ dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }],
};

class Cart {
  constructor(rail, dir, id) {
    this.id = id;
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
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
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
        if (dirMap.includes(cell)) this.carts.push(new Cart(curRail, cell, this.carts.length));

        this.tracks[y][x] = curRail;

        connectionMap[cell].forEach((connection, i) => {
          if (!connection) return;
          const { dx, dy, whiteList } = connection;

          if (this.tracks[y + dy]?.[x + dx]) {
            const neighborRail = this.tracks[y + dy][x + dx];
            if (whiteList && !(whiteList.includes(neighborRail.type))) return;

            curRail.addNeighbour(neighborRail, i);
            neighborRail.addNeighbour(curRail, (i + 2) % 4);
          }
        });
      });
    });
  }

  tracks = [];
  carts = [];

  nextTick() {
    this.carts.sort((a, b) => a.rail.y - b.rail.y || a.rail.x - b.rail.x);
    for (let cart of this.carts) {
      cart.moveTick();
      if (this.carts.find(c => c !== cart && c.rail.x === cart.rail.x && c.rail.y === cart.rail.y)) {
        return { x: cart.rail.x, y: cart.rail.y };
      }
    }
  }

  findFirstCrash() {
    let crashSite;
    while (!crashSite) crashSite = this.nextTick();
    return `${crashSite.x},${crashSite.y}`;
  }
}

const mine = new Track(readFileSync('input.txt', 'utf-8').trim().split('\n').map(line => line.split('')));

console.log(`Part 1: ${mine.findFirstCrash()}`);
