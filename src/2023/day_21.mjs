import * as fs from 'node:fs';

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(line => line.split(''));

const findStartingPosition = () => {
  const y = inputData.findIndex(row => row.includes('S'));
  const x = inputData[y].findIndex(col => col === 'S');
  return { x, y };
};

const directions = {
  'north': { offsetX: 0, offsetY: -1 },
  'east': { offsetX: 1, offsetY: 0 },
  'south': { offsetX: 0, offsetY: 1 },
  'west': { offsetX: -1, offsetY: 0 },
};

const queue = [];
const possibleEndPositions = new Set;

const logPosition = (x, y) => {
  possibleEndPositions.add(`X: ${x} / Y: ${y}`);
};

const tryStep = (x, y, remainingSteps, dir) => {
  y += directions[dir].offsetY;
  x += directions[dir].offsetX;
  remainingSteps -= 1;

  if (y < 0 || y >= inputData.length || x < 0 || x >= inputData[0].length) return;
  if (inputData[y][x] === '#') return;

  queue.push([x, y, remainingSteps]);
};

const takeStep = (x, y, remainingSteps) => {
  queue.push([x, y, remainingSteps]);
  while (queue.length > 0) {
    const [x, y, remainingSteps] = queue.shift();

    if (possibleEndPositions.has(`X: ${x} / Y: ${y}`)) continue;
    if (remainingSteps % 2 === 0) logPosition(x, y);
    if (remainingSteps <= 0) continue;

    Object.keys(directions).forEach(dir => {
      tryStep(x, y, remainingSteps, dir);
    });
  }
};

const startingPosition = findStartingPosition();
takeStep(startingPosition.x, startingPosition.y, 64);

console.log(`Part 1: ${possibleEndPositions.size}`);
