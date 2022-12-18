import * as fs from 'node:fs';

class Cube {
  constructor(data) {
    [this.x, this.y, this.z] = data.split(',').map(n => parseInt(n));

    this.neighbors.push({ cord: [this.x - 1, this.y, this.z] });
    this.neighbors.push({ cord: [this.x + 1, this.y, this.z] });
    this.neighbors.push({ cord: [this.x, this.y - 1, this.z] });
    this.neighbors.push({ cord: [this.x, this.y + 1, this.z] });
    this.neighbors.push({ cord: [this.x, this.y, this.z - 1] });
    this.neighbors.push({ cord: [this.x, this.y, this.z + 1] });
  }

  neighbors = [];
}

const cubes = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(data => new Cube(data));

const numberOfTotalSides = cubes.length * 6;

cubes.forEach(cube => {
  cube.neighbors.forEach(neighbor => {
    const [X, Y, Z] = neighbor.cord;
    neighbor.cube = cubes.find(cube => cube.x === X && cube.y === Y && cube.z === Z);
  });
});

const numberOfCoveredSides = cubes.reduce((acc, cur) => acc + cur.neighbors.filter(neighbor => neighbor.cube).length, 0);

console.log(`Part 1: ${numberOfTotalSides - numberOfCoveredSides}`);
