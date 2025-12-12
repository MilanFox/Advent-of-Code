import { readFileSync } from 'node:fs';

class Shape {
  constructor(data) {
    this.id = data[0];
    this.map = data.split('\n').slice(1).map(line => line.split(''));
    this.area = this.map.reduce((acc, cur) => acc + cur.filter(cell => cell === '#').length, 0);
  }
}

class Region {
  constructor(data, shapes) {
    const [sizeData, shapeData] = data.split(': ');
    [this.width, this.height] = sizeData.split('x').map(Number);
    this.requiredShapes = shapeData.split(' ').map((amount, id) => ({ amount, shape: shapes[id] }));
  }

  get totalArea() {
    return this.width * this.height;
  }

  get totalShapesArea() {
    return this.requiredShapes.reduce((acc, { amount, shape }) => acc + (amount * shape.area), 0);
  }

  get isImpossible() {
    return this.totalArea < this.totalShapesArea;
  }

  get isTrivial() {
    const numberOfCells = Math.floor(this.width / 3) * Math.floor(this.height / 3);
    const neededCells = this.requiredShapes.reduce((acc, { amount }) => acc + Number(amount), 0);
    return numberOfCells >= neededCells;
  };
}

const inputData = readFileSync('input.txt', 'utf-8').trim().split('\n\n');
const regionData = inputData.pop();

const shapes = inputData.map(data => new Shape(data));
const regions = regionData.split('\n').map(data => new Region(data, shapes));

// Wtf?
const possibleRegions = regions.reduce((acc, cur) => acc + !cur.isImpossible, 0);
const trivialRegions = regions.reduce((acc, cur) => acc + cur.isTrivial, 0);

if (possibleRegions === trivialRegions) console.log(`Part 1: ${trivialRegions}`);
