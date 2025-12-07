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

  if (!nextSplitYPos) return { timeLinesAfterSplit: 1 };

  const splitPosHash = `${x}|${nextSplitYPos}`;
  if (memo.get(splitPosHash)) return { timeLinesAfterSplit: memo.get(splitPosHash) };

  const timeLinesAfterSplit = [-1, 1].reduce((acc, dir) => acc + getNumberOfTimelines({
    x: x + dir,
    y: nextSplitYPos,
  }, memo).timeLinesAfterSplit, 0);

  memo.set(splitPosHash, timeLinesAfterSplit);

  return { timeLinesAfterSplit, memo };
};

const { memo, timeLinesAfterSplit } = getNumberOfTimelines(start);

console.log(`Part 1: ${memo.size}`);
console.log(`Part 2: ${timeLinesAfterSplit}`);
