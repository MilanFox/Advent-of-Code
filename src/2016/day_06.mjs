import { readFileSync } from 'node:fs';

const inputData = readFileSync('input.txt', 'utf-8').trim().split('\n');

const decypherSignal = () => {
  const columns = Array.from({ length: inputData[0].length }, (_, i) => inputData.map(line => line[i]));

  const repeatedLetters = columns.map(col => {
    const count = {};
    col.forEach(el => count[el] = (count[el] || 0) + 1);
    return Object.entries(count).toSorted((a, b) => b[1] - a[1]).at(0).at(0);
  });

  return repeatedLetters.join('');
};

console.log(`Part 1: ${decypherSignal()}`);
