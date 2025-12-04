import { readFileSync } from 'node:fs';

const floorMap = readFileSync('input.txt', 'utf-8').trim().split('\n').map(line => line.split(''));

const PAPER_ROLL = '@';

const dirs = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];

const isReachable = ({ x, y }) => {
  const numberOfSurroundingRolls = dirs.reduce((acc, [dx, dy]) => {
    if (floorMap[y + dy]?.[x + dx] !== PAPER_ROLL) return acc;
    return acc + 1;
  }, 0);
  return numberOfSurroundingRolls <= 3;
};

const getReachablePaperRolls = () => {
  const rolls = [];
  for (let y = 0; y < floorMap.length; y++) {
    for (let x = 0; x < floorMap[0].length; x++) {
      if (floorMap[y][x] === PAPER_ROLL && isReachable({ x, y })) rolls.push([x, y]);
    }
  }
  return rolls;
};

console.log(`Part 1: ${getReachablePaperRolls().length}`);

let totalRemovableRolls = 0;

while (true) {
  const removableRolls = getReachablePaperRolls();
  if (!removableRolls.length) break;
  totalRemovableRolls += removableRolls.length;
  removableRolls.forEach(([x, y]) => floorMap[y][x] = '.');
}

console.log(`Part 2: ${totalRemovableRolls}`);
