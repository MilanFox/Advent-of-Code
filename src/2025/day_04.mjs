import { readFileSync } from 'node:fs';

const floorMap = readFileSync('input.txt', 'utf-8').trim().split('\n').map(line => line.split(''));

const PAPER_ROLL = '@';

const dirs = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];

const isReachable = ({ x, y }) =>
  dirs.reduce((acc, [dx, dy]) => (floorMap[y + dy]?.[x + dx] !== PAPER_ROLL) ? acc : (acc + 1), 0) <= 3;

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
