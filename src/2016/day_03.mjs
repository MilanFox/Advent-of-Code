import { readFileSync } from 'node:fs';

const inputData = readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(line => line
    .trim()
    .split('  ')
    .map(Number)
    .sort((a, b) => a - b));

const isValid = ([a, b, c]) => (a + b) > c;

const numberOfValidTriangles = inputData.map(isValid).filter(Boolean).length;

console.log(`Part 1: ${numberOfValidTriangles}`);
