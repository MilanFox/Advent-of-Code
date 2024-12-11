import fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split(' ').map(Number);

const blink = (count) => {
  let stones = [...inputData];
  for (let i = 0; i < count; i++) {
    console.log(i);
    stones = stones.flatMap(stone => {
      if (stone === 0) return 1;
      const digits = stone.toString();
      if (digits.length % 2 === 0) return [
        Number(digits.substring(0, digits.length / 2)),
        Number(digits.substring(digits.length / 2)),
      ];
      return stone * 2024;
    });
  }
  return stones.length;
};

console.log(`Part 1: ${blink(25)}`);
