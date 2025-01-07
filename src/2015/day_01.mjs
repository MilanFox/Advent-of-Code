import fs from 'node:fs';

const instructions = fs.readFileSync('input.txt', 'utf-8').trim().split('');

const elevator = instructions.reduce((acc, cur, i) => {
  if (cur === '(') acc.floor++; else acc.floor--;
  if (acc.floor === -1) acc.earliestBasement = Math.min(i + 1, acc.earliestBasement);
  return acc;
}, { floor: 0, earliestBasement: Infinity });

console.log(`Part 1: ${elevator.floor}`);
console.log(`Part 2: ${elevator.earliestBasement}`);
