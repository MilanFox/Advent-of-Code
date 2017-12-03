import * as fs from 'node:fs';

const inputNumber = parseInt(fs.readFileSync('input.txt', 'utf-8').trim());

const getSideLength = layer => (layer * 2) + 1;
const getArea = layer => getSideLength(layer) ** 2;

const getSpiralLayer = (n) => {
  let layer = 0;
  while (true) {
    if (getArea(layer) >= n) return layer;
    layer += 1;
  }
};

const getRelativePosition = (n) => {
  const layer = getSpiralLayer(n);
  const sideLength = getSideLength(layer);
  const start = getArea(layer - 1);
  const relativeIndex = n - start - 1;
  const quadrant = Math.floor(relativeIndex / (sideLength - 1));
  const quadrantMidpoint = ((sideLength - 1) / 2) + ((sideLength - 1) * quadrant) + getArea(layer - 1);

  switch (quadrant) {
    case 0:
      return { x: (sideLength - 1) / 2, y: quadrantMidpoint - n };
    case 1:
      return { x: quadrantMidpoint - n, y: -((sideLength - 1) / 2) };
    case 2:
      return { x: -((sideLength - 1) / 2), y: n - quadrantMidpoint };
    case 3:
      return { x: n - quadrantMidpoint, y: (sideLength - 1) / 2 };
    default:
      return { x: 0, y: 0 };
  }
};

const getManhattanDistance = relativePosition => Math.abs(relativePosition.x) + Math.abs(relativePosition.y);

console.log(`Part 1: ${getManhattanDistance(getRelativePosition(inputNumber))}`);
