import { readFileSync } from 'node:fs';

const inputData = readFileSync('input.txt', 'utf-8').trim().split('\n');

const decypherSignal = ({ method }) => {
  const columns = Array.from({ length: inputData[0].length }, (_, i) => inputData.map(line => line[i]));

  const repeatedLetters = columns.map(col => {
    const count = {};
    col.forEach(el => count[el] = (count[el] || 0) + 1);

    const letterCount = Object.entries(count);
    if (method === 'mostCommon') letterCount.sort((a, b) => b[1] - a[1]);
    if (method === 'leastCommon') letterCount.sort((a, b) => a[1] - b[1]);

    return letterCount.at(0).at(0);
  });

  return repeatedLetters.join('');
};

console.log(`Part 1: ${decypherSignal({ method: 'mostCommon' })}`);
console.log(`Part 2: ${decypherSignal({ method: 'leastCommon' })}`);
