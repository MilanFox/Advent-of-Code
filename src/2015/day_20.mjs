import fs from 'node:fs';

const input = Number(fs.readFileSync('input.txt', 'utf-8').trim());

const handOutPresents = (upperBounds, housesPerElf = Infinity, multiplier = 10) => {
  const houses = [0];
  for (let elf = 1; elf <= upperBounds; elf++) {
    for (let i = elf; i <= Math.min(elf * housesPerElf, upperBounds); i += elf) {
      houses[i] = (houses[i] ?? 0) + elf * multiplier;
    }
  }
  return houses;
};

const house1 = handOutPresents(1_000_000).findIndex(presentCount => presentCount >= input);
console.log(`Part 1: ${house1}`);

const house2 = handOutPresents(1_000_000, 50, 11).findIndex(presentCount => presentCount >= input);
console.log(`Part 2: ${house2}`);
