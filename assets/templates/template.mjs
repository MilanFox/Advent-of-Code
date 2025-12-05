import { readFileSync } from 'node:fs';

const inputData = readFileSync('testInput.txt', 'utf-8').trim().split('\n');

console.log(inputData);
