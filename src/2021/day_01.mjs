import * as fs from 'node:fs';

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(data => parseInt(data));

const toNumberOfIncreases = (acc, cur, i, arr) => acc + (cur > arr[i - 1]);

console.log(`Part 1: ${inputData.reduce(toNumberOfIncreases, 0)}`);

const toSumOfThree = (acc, cur, i, arr) => [...acc, [cur, arr[i + 1], arr[i + 2]].reduce((acc, cur) => acc + cur, 0)];

console.log(`Part 2: ${inputData.reduce(toSumOfThree, []).filter(el => !Number.isNaN(el)).reduce(toNumberOfIncreases, 0)}`);

