import * as fs from 'node:fs';

const fishes = fs.readFileSync('input.txt', 'utf-8').trim().split(',').map(data => parseInt(data)).sort();
const memo = Array.from({ length: 9 }, () => [1]);

const createMemo = (days) => {
  for (let day = 1; day <= days; day++) {
    for (let fish = 0; fish <= 8; fish++) {
      if (fish === 0) memo[fish][day] = memo[8][day - 1] + memo[6][day - 1];
      else memo[fish][day] = memo[fish - 1][day - 1];
    }
  }
};

const getPopulation = (days) => {
  createMemo(days);
  return fishes.map(fish => memo[fish][days]).reduce((acc, cur) => acc + cur, 0);
};

console.log(`Part 1: ${getPopulation(80)}`);
console.log(`Part 2: ${getPopulation(256)}`);

