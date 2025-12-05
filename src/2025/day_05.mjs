import { readFileSync } from 'node:fs';

const [rangeData, ingredientData] = readFileSync('input.txt', 'utf-8').trim().split('\n\n');

const freshRanges = rangeData
  .split('\n')
  .map(line => line.split('-').map(Number))
  .toSorted((([startA, endA], [startB, endB]) => startA - startB || endA - endB))
  .reduce((acc, [start, end]) => {
    const last = acc.at(-1);
    if (!last) acc.push([start, end]);
    else if (last[1] < start) acc.push([start, end]);
    else if (last[1] < end) last[1] = end;
    return acc;
  }, []);

const ingredients = ingredientData.split('\n').map(Number);

const isFresh = id => freshRanges.some(([start, end]) => id >= start && id <= end);

console.log(`Part 1: ${ingredients.reduce((acc, cur) => acc + isFresh(cur), 0)}`);
console.log(`Part 2: ${freshRanges.reduce((acc, [start, end]) => acc + (end - start) + 1, 0)}`);
