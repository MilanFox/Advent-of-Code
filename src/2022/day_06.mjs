import * as fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('');
const findFirstSetOfNDistinctChars = (n) => inputData.findIndex((_, i) => new Set(inputData.slice(i, i + n)).size === n) + n;

console.log(`Part 1: ${findFirstSetOfNDistinctChars(4)}`);
console.log(`Part 1: ${findFirstSetOfNDistinctChars(14)}`);
