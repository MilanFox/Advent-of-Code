import fs from 'node:fs';

class Present {
  constructor(data) {
    this.dimensions = data.split('x').map(Number);
  }

  get requiredWrappingPaper() {
    const [l, w, h] = this.dimensions;
    const sides = [l * w, w * h, h * l];
    return sides.reduce((acc, cur) => acc + 2 * cur, 0) + Math.min(...sides);
  }

  get requiredLengthOfRibbon() {
    const [l, w, h] = this.dimensions;
    const [sideA, sideB] = this.dimensions.sort((a, b) => a - b);
    return 2 * sideA + 2 * sideB + (l * w * h);
  }
}

const presents = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new Present(data));

const totalWrappingPaper = presents.reduce((acc, cur) => acc + cur.requiredWrappingPaper, 0);
console.log(`Part 1: ${totalWrappingPaper}`);

const totalRibbonLength = presents.reduce((acc, cur) => acc + cur.requiredLengthOfRibbon, 0);
console.log(`Part 2: ${totalRibbonLength}`);
