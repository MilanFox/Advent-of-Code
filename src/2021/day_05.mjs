import * as fs from 'node:fs';

class Line {
  constructor(data) {
    const [x, y] = data.split(' -> ');
    [this.x1, this.y1] = x.split(',').map(n => parseInt(n));
    [this.x2, this.y2] = y.split(',').map(n => parseInt(n));
    this.isOrthogonal = this.x1 === this.x2 || this.y1 === this.y2;
  }

  draw() {
    let yStep = Math.sign(this.y2 - this.y1);
    let xStep = Math.sign(this.x2 - this.x1);
    let y = this.y1;
    let x = this.x1;

    while (true) {
      if (oceanFloor[y][x] === '.') oceanFloor[y][x] = 0;
      oceanFloor[y][x] += 1;
      if (x === this.x2 && y === this.y2) break;
      y += yStep;
      x += xStep;
    }
  }
}

const lines = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new Line(data));
const xMax = lines.reduce((acc, cur) => Math.max(acc, cur.x1, cur.x2), 0);
const yMax = lines.reduce((acc, cur) => Math.max(acc, cur.y1, cur.y2), 0);
let oceanFloor;

const resetOceanFloor = () => {oceanFloor = Array.from({ length: yMax + 1 }, () => Array.from({ length: xMax + 1 }, () => '.'));};
const getDangerousSpots = () => oceanFloor.flat().filter(cell => cell > 1).length;

resetOceanFloor();
lines.filter(line => line.isOrthogonal).forEach(line => line.draw());
console.log(`Part 1: ${getDangerousSpots()}`);

resetOceanFloor();
lines.forEach(line => line.draw());
console.log(`Part 2: ${getDangerousSpots()}`);
