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

  nextTick() {
    const nextMap = this.map.map(row => row.map(({ neighbours, ground }) => ground.nextState(neighbours)));

    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        this.map[y][x].ground = nextMap[y][x];
      }
    }
  }

  get totalRessourceValue() {
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
}

class Tree {
  nextState(neighbours) {
    const numberOfNeighbouringYards = neighbours.filter(neighbor => neighbor.ground instanceof LumberYard).length;
    if (numberOfNeighbouringYards >= 3) return new LumberYard();
    return this;
  }
}

class LumberYard {
  nextState(neighbours) {
    const numberOfNeighbouringTrees = neighbours.filter(neighbor => neighbor.ground instanceof Tree).length;
    const numberOfNeighbouringYards = neighbours.filter(neighbor => neighbor.ground instanceof LumberYard).length;
    if (numberOfNeighbouringTrees >= 1 && numberOfNeighbouringYards >= 1) return this;
    return new OpenGround();
  }
}

const inputData = readFileSync('input.txt', 'utf-8');
const area = new LumberCollectionArea(inputData);

for (let i = 0; i < 10; i++) area.nextTick();
console.log(`Part 1: ${area.totalRessourceValue}`);

