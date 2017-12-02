import * as fs from 'node:fs';

const spreadSheet = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(row => row.split('\t').map(n => parseInt(n)));

const checksum = spreadSheet.reduce((total, row) => {
  const sortedRow = row.toSorted((a, b) => a - b);
  return total + sortedRow.at(-1) - sortedRow.at(0);
}, 0);

console.log(`Part 1: ${checksum}`);

const findEvenlyDivisibleNumbersInRow = (row) => {
  for (let a = 0; a < row.length; a++) {
    for (let b = a + 1; b < row.length; b++) {
      if (row[a] % row[b] === 0 || row[b] % row[a] === 0) return [row[a], row[b]].toSorted((a, b) => b - a);
    }
  }
};

console.log(`Part 2: ${spreadSheet.map(findEvenlyDivisibleNumbersInRow).reduce((acc, cur) => acc + (cur[0] / cur[1]), 0)}`);
