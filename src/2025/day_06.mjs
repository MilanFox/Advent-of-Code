import { readFileSync } from 'node:fs';

const inputData = readFileSync('input.txt', 'utf-8').trim().split('\n').map(line => line.trim().split(/\s+/));
const operator = inputData.pop();

const grandTotal = inputData[0].reduce((total, first, i) =>
    total + inputData.reduce((acc, cur, j) => {
            if (j === 0) return acc;
            if (operator[i] === '+') return acc + Number(cur[i]);
            if (operator[i] === '*') return acc * Number(cur[i]);
          }, Number(first)),
  0);

console.log(`Part 1: ${grandTotal}`);
