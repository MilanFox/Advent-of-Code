import { readFileSync } from 'node:fs';

const batteryBanks = readFileSync('input.txt', 'utf-8').trim().split('\n').map(bank => bank.split('').map(Number));

const getBankJoltage = (bank) => {
  const first = bank.reduce((acc, cur, i) => {
    if (i === bank.length - 1) return acc;
    if (cur > acc.value) {
      acc.value = cur;
      acc.i = i;
    }
    return acc;
  }, { value: -1, i: -1 });

  const second = bank.slice(first.i + 1).reduce((acc, cur) => cur > acc ? cur : acc, 0);

  return Number(`${first.value}${second}`);
};

console.log(`Part 1: ${batteryBanks.reduce((acc, cur) => acc + getBankJoltage(cur), 0)}`);
