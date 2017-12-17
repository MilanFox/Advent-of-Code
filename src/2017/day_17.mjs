import * as fs from 'node:fs';

const steps = parseInt(fs.readFileSync('input.txt', 'utf-8').trim());

const spinLock = [0];
let lastIndex = 0;

for (let i = 1; i <= 2017; i++) {
  const insertPosition = (lastIndex + steps) % i;
  spinLock.splice(insertPosition + 1, 0, i);
  lastIndex = insertPosition + 1;
}

console.log(`Part 1: ${spinLock[lastIndex + 1]}`);

let indexOne = spinLock[1];
let currentIndex = 0;

for (let i = 0; i <= 50_000_000; i++) {
  currentIndex = (currentIndex + steps + 1) % (i + 1);
  if (currentIndex === 0) indexOne = i + 1;
}

console.log(`Part 2: ${indexOne}`);
