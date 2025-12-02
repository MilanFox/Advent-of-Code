import { readFileSync } from 'node:fs';

const inputData = readFileSync('testinput.txt', 'utf-8').trim().split(',').map(line => line.split('-'));

const findInvalidIDsInRange = (range) => {
  const [start, end] = range.map(Number);

  let checksum = 0;

  let i = start;

  search: while (true) {
    if (i > end) break;
    const curNumber = String(i);
    let a = 0;
    let b = curNumber.length / 2;

    i++;

    for (let j = 0; j < curNumber.length / 2; j++) {
      if (curNumber[a + j] !== curNumber[b + j]) continue search;
    }

    checksum += Number(curNumber);
  }

  return checksum;
};

console.log(`Part 1: ${inputData.reduce((acc, cur) => acc + findInvalidIDsInRange(cur), 0)}`);
