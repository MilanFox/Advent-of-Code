import * as fs from 'node:fs';

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(data => data.split(' '))
  .map(([dir, length]) => [dir, parseInt(length)]);

const getSumOfInstructions = (instruction) => inputData.filter(([dir]) => dir === instruction).reduce((acc, [_, length]) => acc + length, 0);
console.log(`Part 1: ${getSumOfInstructions('forward') * (getSumOfInstructions('down') - getSumOfInstructions('up'))}`);

const submarine = inputData.reduce((acc, [dir, length]) => {
  if (dir === 'down') acc.aim += length;
  if (dir === 'up') acc.aim -= length;
  if (dir === 'forward') {
    acc.distance += length;
    acc.depth += acc.aim * length;
  }
  return acc;
}, { depth: 0, distance: 0, aim: 0 });

console.log(`Part 2: ${submarine.distance * submarine.depth}`);
