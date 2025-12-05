import { readFileSync } from 'node:fs';

const [freshnessData, ingredientData] = readFileSync('input.txt', 'utf-8').trim().split('\n\n');

const freshRanges = freshnessData
  .split('\n')
  .map(line => line.split('-').map(Number))
  .toSorted((([startA, endA], [startB, endB]) => startA - startB || endA - endB)) //?
  .reduce((acc, [start, end]) => {
    if (!acc.at(-1)) {
      acc.push([start, end]);
      return acc;
    }

    if (acc.at(-1)[0] <= start && acc.at(-1)[1] >= end) return acc;

    if (acc.at(-1)[1] >= start && acc.at(-1)[1] <= end) {
      acc.at(-1)[1] = end;
      return acc;
    }

    acc.push([start, end]);
    return acc;
  }, []);

const ingredients = ingredientData.split('\n').map(Number);

const isFresh = (id) => {
  for (const [start, end] of freshRanges) if (id >= start && id <= end) return true;
  return false;
};

console.log(`Part 1: ${ingredients.reduce((acc, cur) => acc + isFresh(cur), 0)}`);
console.log(`Part 2: ${freshRanges.reduce((acc, [start, end]) => acc + (end - start) + 1, 0)}`);
