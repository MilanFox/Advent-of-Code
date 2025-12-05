import { readFileSync } from 'node:fs';

const [freshnessData, ingredientData] = readFileSync('input.txt', 'utf-8').trim().split('\n\n');

const freshRanges = freshnessData.split('\n').map(line => line.split('-').map(Number));
const ingredients = ingredientData.split('\n').map(Number);

const isFresh = (id) => {
  for (const [start, end] of freshRanges) if (id >= start && id <= end) return true;
  return false;
};

console.log(`Part 1: ${ingredients.reduce((acc, cur) => acc + isFresh(cur), 0)}`);
