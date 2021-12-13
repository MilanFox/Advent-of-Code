import * as fs from 'node:fs';

class Instruction {
  constructor(data) {
    const [axis, index] = data.split('=');
    this.direction = axis.at(-1) === 'x' ? 'left' : 'up';
    this.line = parseInt(index);
  }
}

class Paper {
  constructor(data) {
    const [dots, instructions] = data.trim().split('\n\n');
    this.dots = dots.split('\n');
    this.instructions = instructions.split('\n').map(data => new Instruction(data));
    this.#snapshots = [[...this.dots]];

    this.instructions.forEach(instruction => this.fold(instruction));
  }

  #snapshots;

  fold({ direction, line }) {
    const deduplicate = (arr) => [...new Set(arr)].toSorted();
    this.dots = deduplicate(this.dots.map(dot => {
      let [x, y] = dot.split(',').map(n => parseInt(n));
      if (direction === 'left' && x > line) x = line - (x - line);
      if (direction === 'up' && y > line) y = line - (y - line);
      return [x, y].join(',');
    }));
    this.#snapshots.push([...this.dots]);
  }

  get numberOfDots() {
    return this.#snapshots.map(snapshot => snapshot.length);
  }

  printCode() {
    const dots = this.dots.map(dot => dot.split(',').map(n => parseInt(n)));
    const [xMax, yMax] = dots.reduce(([X, Y], [x, y]) => [Math.max(X, x), Math.max(Y, y)], [0, 0]);
    const matrix = Array.from({ length: yMax + 1 }, () => Array.from({ length: xMax + 1 }, () => ' '));
    dots.forEach(([x, y]) => matrix[y][x] = '█');
    return matrix.map(line => line.join('')).join('\n        ');
  }
}

const paper = new Paper(fs.readFileSync('input.txt', 'utf-8'));

console.log(`Part 1: ${paper.numberOfDots.at(1)}`);
console.log(`Part 2: ${paper.printCode()}`);
