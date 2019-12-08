import * as fs from 'node:fs';

class Layer {
  constructor(data, { width, height }) {
    this.data = Array.from({ length: height }, (_, i) => data.slice(width * i, width * (i + 1)));
  }

  count(n) {
    return this.data.flat().filter(pixel => pixel === n).length;
  }
}

class Image {
  constructor(data, { width, height }) {
    this.width = width;
    this.height = height;

    const layerSize = width * height;
    const numberOfLayers = data.length / layerSize;
    this.layers = Array.from({ length: numberOfLayers }, (_, i) => new Layer(data.slice(layerSize * i, layerSize * (i + 1)), options));
  }

  get checksum() {
    const targetLayer = this.layers.toSorted((a, b) => a.count(0) - b.count(0)).at(0);
    return targetLayer.count(1) * targetLayer.count(2);
  }

  getColorAt({ y, x }) {
    const colorValue = this.layers.find(layer => layer.data[y][x] !== 2).data[y][x];
    const colorValueMap = { 0: ' ', 1: '█' };
    return colorValueMap[colorValue];
  }

  get renderedImage() {
    return Array
      .from({ length: this.height }, (_, y) => Array
        .from({ length: this.width }, (_, x) => this.getColorAt({ y, x }))
        .join(''))
      .join('\n');

  }
}

const options = { width: 25, height: 6 };
const image = new Image(fs.readFileSync('input.txt', 'utf-8').trim().split('').map(n => parseInt(n)), options);

console.log(`Part 1: ${image.checksum}`);
console.log(`Part 2:\n${image.renderedImage}`);
