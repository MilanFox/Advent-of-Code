import { readFileSync } from 'node:fs';

const map = readFileSync('input.txt', 'utf-8').trim().split('\n').map(line => line.split(''));

const startX = map[0].findIndex(el => el === 'S');

const shootBeam = ({ x, y }, seenSplitters = new Set()) => {
  let nextSplitYPos;

  for (let curYPos = y; curYPos < map.length; curYPos++) {
    if (map[curYPos][x] === '^') {
      nextSplitYPos = curYPos;
      break;
    }
  }

  if (nextSplitYPos && !seenSplitters.has(`${x}|${nextSplitYPos}`)) {
    seenSplitters.add(`${x}|${nextSplitYPos}`);
    shootBeam({ x: x - 1, y: nextSplitYPos }, seenSplitters);
    shootBeam({ x: x + 1, y: nextSplitYPos }, seenSplitters);
  }

  return { seenSplitters };
};

const { seenSplitters } = shootBeam({ x: startX, y: 1 });

console.log(`Part 1: ${seenSplitters.size}`);
