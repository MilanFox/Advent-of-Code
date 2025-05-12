import { readFileSync } from 'node:fs';

const inputData = readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(line => line
    .trim()
    .split(/\s+/)
    .map(Number));

const isValid = ([a, b, c]) => (a + b) > c;

const getNumberOfValidSets = (sets) => sets
  .map(set => set.toSorted((a, b) => a - b))
  .map(isValid)
  .filter(Boolean).length;

console.log(`Part 1: ${getNumberOfValidSets(inputData)}`);

const verticalDataSet = inputData
  .reduce((acc, _, i, arr) => {
    if (i % 3 !== 0) return acc;
    const group = arr.slice(i, i + 3);
    const transposed = group[0].map((_, j) => group.map(row => row[j]));
    return [...acc, ...transposed];
  }, []);

console.log(`Part 2: ${getNumberOfValidSets(verticalDataSet)}`);
