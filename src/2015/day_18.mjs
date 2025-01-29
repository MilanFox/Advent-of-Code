import fs from 'node:fs';

let lights = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(row => row.split('').map(cell => cell === '#'));

const originalSetup = lights;

const dirs = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]];

const getNumberOfLitNeighbors = ({ x, y }) => {
  return dirs.reduce((acc, [dx, dy]) => acc + Number(lights[y + dy]?.[x + dx] ?? 0), 0);
};

const getNextSnapshot = () => Array.from({ length: lights.length }, (_, y) =>
  Array.from({ length: lights[y].length }, (__, x) => {
    if (lights[y][x] === true) {
      const litNeighbors = getNumberOfLitNeighbors({ x, y });
      return litNeighbors === 2 || litNeighbors === 3;
    } else {
      return getNumberOfLitNeighbors({ x, y }) === 3;
    }
  }),
);

const getTotalLitLights = () => lights.reduce((total, row) => total + row.reduce((acc, cell) => acc + Number(cell)), 0);

const turnOnCornerLights = () => {
  lights[0][0] = true;
  lights[0][lights[0].length - 1] = true;
  lights[lights.length - 1][0] = true;
  lights[lights.length - 1][lights[0].length - 1] = true;
};

const simulateSteps = (steps, pinCornerLights) => {
  for (let i = 0; i < steps; i++) {
    lights = getNextSnapshot(pinCornerLights);
    if (pinCornerLights) turnOnCornerLights();
  }
};

simulateSteps(100);
console.log(`Part 1: ${getTotalLitLights()}`);

lights = originalSetup;
turnOnCornerLights();
simulateSteps(100, true);
console.log(`Part 1: ${getTotalLitLights()}`);
