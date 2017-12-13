import * as fs from 'node:fs';

class Layer {
  constructor(data) {
    [this.depth, this.range] = data.split(': ').map(n => parseInt(n));
  }

  get severity() {
    return this.depth * this.range;
  }

  get period() {
    return (this.range - 1) * 2;
  }
}

const layers = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new Layer(data));

const getSeverity = (delay) => layers
  .filter(layer => (layer.depth + delay) % layer.period === 0)
  .map(layer => layer.severity)
  .reduce((acc, cur) => acc + cur, 0);

console.log(`Part 1: ${getSeverity(0)}`);

const findMinDelay = () => {
  const isCaught = (delay) => layers.some(layer => (layer.depth + delay) % layer.period === 0);
  let delay = 0;
  while (isCaught(delay)) delay += 1;
  return delay;
};

console.log(`Part 2: ${findMinDelay()}`);
