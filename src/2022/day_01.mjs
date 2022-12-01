import * as fs from 'node:fs';

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n\n')
  .map(elf => elf.split('\n').map(cal => parseInt(cal, 10)));

const totalCalories = inputData.map(elf => elf.reduce((acc, cur) => acc + cur, 0)).toSorted((a, b) => b - a);

console.log(`Part 1: ${totalCalories.at(0)}`);
console.log(`Part 2: ${totalCalories.slice(0, 3).reduce((acc, cur) => acc + cur, 0)}`);
