import { readFileSync } from 'node:fs';

class LumberCollectionArea {
  constructor(data) {
    this.map = data.split('\n').map(row => row.split('').map(cell => {
        let ground;
        if (cell === '|') ground = new Tree();
        if (cell === '#') ground = new LumberYard();
        if (cell === '.') ground = new OpenGround();

        return { ground, neighbours: [] };
      }),
    );

    const dirs = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];

    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        dirs.forEach(([dx, dy]) => {
          const neighbour = this.map[y + dy]?.[x + dx];
          if (!neighbour) return;
          this.map[y][x].neighbours.push(neighbour);
        });
      }
    }
  }

  get stateHash() {
    return this.map.map(row => row.map(({ ground }) => ground.symbol).join('')).join('\n');
  }

  nextTick() {
    const nextMap = this.map.map(row => row.map(({ neighbours, ground }) => ground.nextState(neighbours)));

    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        this.map[y][x].ground = nextMap[y][x];
      }
    }
  }

  seen = [];
  minutes = 0;
  loopIn = undefined;
  loopOut = undefined;

  forwardTo(mins) {
    if (this.loopIn && this.loopOut) {
      this.minutes = mins - 1;
      return;
    }

    while (this.minutes < mins) {
      this.minutes += 1;
      this.nextTick();
      const hash = this.stateHash;

      if (this.seen.some(el => el.hash === hash)) {
        this.loopOut = this.seen.length;
        this.loopIn = this.seen.findIndex(el => el.hash === hash);
        this.minutes = mins - 1;
        break;
      }

      this.seen.push({ hash, value: this.totalRessourceValue });
    }
  }

  get totalRessourceValue() {
    if (this.loopIn && this.loopOut) {
      const loopLength = this.loopOut - this.loopIn;
      const remaining = (this.minutes - this.loopIn) % loopLength;
      return this.seen[this.loopIn + remaining].value;
    }

    const numberOfTrees = this.map.flat().filter(({ ground }) => ground instanceof Tree).length;
    const numberOfYards = this.map.flat().filter(({ ground }) => ground instanceof LumberYard).length;
    return numberOfTrees * numberOfYards;
  }
}

class OpenGround {
  nextState(neighbours) {
    const numberOfNeighbouringTrees = neighbours.filter(neighbor => neighbor.ground instanceof Tree).length;
    if (numberOfNeighbouringTrees >= 3) return new Tree();
    return this;
  }

  get symbol() {
    return '.';
  }
}

class Tree {
  nextState(neighbours) {
    const numberOfNeighbouringYards = neighbours.filter(neighbor => neighbor.ground instanceof LumberYard).length;
    if (numberOfNeighbouringYards >= 3) return new LumberYard();
    return this;
  }

  get symbol() {
    return '|';
  }
}

class LumberYard {
  nextState(neighbours) {
    const numberOfNeighbouringTrees = neighbours.filter(neighbor => neighbor.ground instanceof Tree).length;
    const numberOfNeighbouringYards = neighbours.filter(neighbor => neighbor.ground instanceof LumberYard).length;
    if (numberOfNeighbouringTrees >= 1 && numberOfNeighbouringYards >= 1) return this;
    return new OpenGround();
  }

  get symbol() {
    return '#';
  }
}

const inputData = readFileSync('input.txt', 'utf-8');
const area = new LumberCollectionArea(inputData);

area.forwardTo(10);
console.log(`Part 1: ${area.totalRessourceValue}`);

area.forwardTo(1000000000);
console.log(`Part 2: ${area.totalRessourceValue}`);

//215130 too low

