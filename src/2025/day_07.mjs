import { readFileSync } from 'node:fs';

const map = readFileSync('input.txt', 'utf-8').trim().split('\n').map(line => line.split(''));

const start = { x: map[0].findIndex(el => el === 'S'), y: 1 };

const getNumberOfTimelines = ({ x, y }, memo = new Map()) => {
  let nextSplitYPos;

  for (let curYPos = y; curYPos < map.length; curYPos++) {
    if (map[curYPos][x] === '^') {
      nextSplitYPos = curYPos;
      break;
    }
  }

  if (!nextSplitYPos) return 1;

  const splitPosHash = `${x}|${nextSplitYPos}`;
  if (memo.get(splitPosHash)) return memo.get(splitPosHash);

  const timeLinesAfterSplit = [-1, 1].reduce((acc, dir) => acc + getNumberOfTimelines({
    x: x + dir,
    y: nextSplitYPos,
  }, memo), 0);

  memo.set(splitPosHash, timeLinesAfterSplit);

  return timeLinesAfterSplit;
};

console.log(`Part 2: ${getNumberOfTimelines(start)}`);
