import { readFileSync } from 'node:fs';

const batteryBanks = readFileSync('input.txt', 'utf-8').trim().split('\n').map(bank => bank.split('').map(Number));

const getJoltage = (bank, fuseCount) => {
  const fuses = [];

  for (let i = fuseCount - 1; i >= 0; i--) {
    const start = (fuses.at(-1)?.index ?? -1) + 1;
    const end = i === 0 ? bank.length : -i;
    const nextFuse = bank.slice(start, end).reduce((acc, cur, j) => {
      if (cur > acc.value) {
        acc.value = cur;
        acc.index = start + j;
      }
      return acc;
    }, { index: -1, value: -1 });

    fuses.push(nextFuse);
  }

  return Number(fuses.map(({ value }) => value).join(''));
};

console.log(`Part 1: ${batteryBanks.reduce((acc, cur) => acc + getJoltage(cur, 2), 0)}`);
console.log(`Part 2: ${batteryBanks.reduce((acc, cur) => acc + getJoltage(cur, 12), 0)}`);
