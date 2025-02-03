import fs from 'node:fs';

const input = Number(fs.readFileSync('input.txt', 'utf-8').trim()) / 10;

const handOutPresents = (n) => {
  const houses = [0];
  for (let elf = 1; elf <= n; elf++) {
    for (let i = elf; i <= n; i += elf) {
      houses[i] = (houses[i] ?? 0) + elf;
    }
  }
  return houses;
};

const houses = handOutPresents(input);
const targetHouse = houses.findIndex(presentCount => presentCount >= input);

console.log(`Part 1: ${targetHouse}`);
