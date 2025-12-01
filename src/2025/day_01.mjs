import { readFileSync } from 'node:fs';

const inputData = readFileSync('input.txt', 'utf-8').trim().replaceAll('L', '-').replaceAll('R', '+').split('\n').map(Number);

const dial = { position: 50, homePositionReached: 0, homePositionPassed: 0 };

const rotate = (value) => {
  const targetValue = dial.position + value;

  if (targetValue < 0) {
    dial.homePositionPassed += Math.floor((dial.position - 1) / 100) - Math.floor((targetValue - 1) / 100);
    if (targetValue % 100 === 0) dial.homePositionPassed -= 1;
  }

  if (targetValue > 99) {
    dial.homePositionPassed += Math.floor(targetValue / 100);
    if (targetValue % 100 === 0) dial.homePositionPassed -= 1;
  }

  dial.position = ((targetValue % 100) + 100) % 100;
  if (dial.position === 0) dial.homePositionReached += 1;
};

inputData.forEach(rotate);

console.log(`Part 1: ${dial.homePositionReached}`);
console.log(`Part 2: ${dial.homePositionReached + dial.homePositionPassed}`);
