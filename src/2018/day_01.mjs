import * as fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(n => parseInt(n));

console.log(`Part 1: ${inputData.reduce((acc, cur) => acc + cur, 0)}`);

const findRepeatingFrequency = () => {
  const frequencyHistory = new Set();
  let i = 0;
  let frequency = 0;

  while (true) {
    frequency += inputData[i];
    if (frequencyHistory.has(frequency)) return frequency;
    frequencyHistory.add(frequency);
    i = (i + 1) % inputData.length;
  }
};

console.log(`Part 2: ${findRepeatingFrequency()}`);
