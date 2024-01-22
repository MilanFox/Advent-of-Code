import fs from "fs";

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map(line => line.split(''));

const start = {y: 0, x: inputData[0].findIndex(cell => cell === '.')};
const lastRow = inputData.length - 1;
const end = {y: lastRow, x: inputData[lastRow].findIndex(cell => cell === '.')};

const directions = {
  'north': {offsetX: 0, offsetY: -1},
  'east': {offsetX: 1, offsetY: 0},
  'south': {offsetX: 0, offsetY: 1},
  'west': {offsetX: -1, offsetY: 0}
};

const isInBounds = ({x, y}) => y >= 0 && y < inputData.length && x >= 0 && x < inputData[0].length

const possiblePaths = [];

const stepForward = (pos, route = []) => {
  const stack = [];
  stack.push([pos, route]);

  const tryStep = (x, y, dir, route) => {
    const newX = x + directions[dir].offsetX;
    const newY = y + directions[dir].offsetY;
    if (!route.includes(`${newY}/${newX}`) &&
      isInBounds({x: newX, y: newY}) &&
      inputData[newY][newX] !== '#') {
      stack.push([{x: newX, y: newY}, [...route, `${newY}/${newX}`]]);
    }
  }

  while (stack.length > 0) {
    const [{x, y}, route] = stack.pop();

    if (x === end.x && y === end.y) {
      possiblePaths.push(route);
      continue;
    }

    if (inputData[y][x] === ">" || inputData[y][x] === "v") {
      const dir = inputData[y][x] === ">" ? "east" : "south";
      tryStep(x, y, dir, route);
      continue;
    }

    for (let i = 0; i < Object.keys(directions).length; i++) {
      const dir = Object.keys(directions)[i];
      tryStep(x, y, dir, route);
    }
  }
}

stepForward(start);

console.log(`Part 1: ${possiblePaths.map(path => path.length).toSorted().at(-1)}`);
