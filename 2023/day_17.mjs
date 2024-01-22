import fs from "fs";

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map(line => line.split('').map(n => parseInt(n, 10)));

const directions = {
  'north': { offsetX: 0, offsetY: -1, opposite: 'south' },
  'east': { offsetX: 1, offsetY: 0, opposite: 'west'},
  'south': { offsetX: 0, offsetY: 1, opposite: 'north'},
  'west': { offsetX: -1, offsetY: 0, opposite: 'east'}
};

const allDirections = Object.keys(directions);


const pathCache = Array.from({length: inputData.length}, () => Array.from({length: inputData[0].length}, () => ({})));
let smallestHeatLoss = Number.MAX_VALUE;

const pushCrucible = ({x, y, comingFrom, step = 0, heatLoss = 0}) => {
  const pathfindingStack = [];
  pathfindingStack.push({ x, y, comingFrom, step, heatLoss });

  while (pathfindingStack.length > 0) {
    const { x, y, comingFrom, step, heatLoss } = pathfindingStack.pop();

    if (y < 0 || y >= inputData.length || x < 0 || x >= inputData[0].length) continue;

    const currentCell = inputData[y][x];
    let currentHeat = heatLoss;
    if (comingFrom) currentHeat += currentCell;

    if (currentHeat > smallestHeatLoss ) continue;

    if (pathCache[y][x][comingFrom]
      && step >= pathCache[y][x][comingFrom].step
      && currentHeat >= pathCache[y][x][comingFrom].currentHeat) continue;

    if (x === inputData[0].length - 1 && y === inputData.length - 1) {
      smallestHeatLoss = Math.min(smallestHeatLoss, currentHeat);
      continue;
    }

    pathCache[y][x][comingFrom] = {step, currentHeat};

    const lockedDirection = [comingFrom];
    if (step >= 3) lockedDirection.push(directions[comingFrom].opposite);

    allDirections.forEach((dir) => {
      if(!lockedDirection.includes(dir)) {
        pathfindingStack.push({
            x: x +directions[dir].offsetX,
            y: y +directions[dir].offsetY,
            comingFrom: directions[dir].opposite,
            step: directions[dir].opposite === comingFrom ? step + 1 : 1,
            heatLoss: currentHeat,
          }
        )
      }
    })
  }
};

pushCrucible({x: 0, y: 0}); // Runs ~1min unfortunately
console.log(`Part 1: ${smallestHeatLoss}`);


