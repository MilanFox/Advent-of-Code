import * as fs from 'node:fs';

class Claim {
  constructor(data) {
    const [id, _, positionData, sizeData] = data.split(' ');
    this.id = id.substring(1);
    [this.posX, this.posY] = positionData.split(',').map(n => parseInt(n));
    [this.sizeX, this.sizeY] = sizeData.split('x').map(n => parseInt(n));
  }

  get bottomRightCorner() {
    return { x: this.posX + this.sizeX, y: this.posY + this.sizeY };
  }

  get hasOverlapWithAny() {
    const slice = [];
    for (let i = this.posY; i < this.posY + this.sizeY && i < fabric.length; i++) {
      const rowSlice = fabric[i].slice(this.posX, this.posX + this.sizeX);
      slice.push(rowSlice);
    }
    return slice.flat().some(n => n > 1);
  }
}

const claims = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new Claim(data));

const toMaxSize = (acc, { bottomRightCorner: { x, y } }) => ({ x: Math.max(x, acc.x), y: Math.max(y, acc.y) });
const fabricSize = claims.reduce(toMaxSize, { x: 0, y: 0 });
const fabric = Array.from({ length: fabricSize.y }, () => Array.from({ length: fabricSize.x }, () => 0));

claims.forEach(({ posY, posX, sizeY, sizeX }) => {
  for (let y = posY; y < posY + sizeY; y++) {
    for (let x = posX; x < posX + sizeX; x++) {
      fabric[y][x] += 1;
    }
  }
});

const claimedByAtLeastTwo = fabric.flat().filter(n => n >= 2).length;

console.log(`Part 1: ${claimedByAtLeastTwo}`);
console.log(`Part 2: ${claims.find(claim => !claim.hasOverlapWithAny).id}`);
