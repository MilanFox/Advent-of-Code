import { readFileSync } from 'node:fs';

const inputData = readFileSync('input.txt', 'utf-8').trim().split(',').map(line => line.split('-'));

const clampToEvenNumbers = (range) => {
  let [start, end] = range;
  if (start.length % 2 !== 0) start = 10 ** start.length;
  if (end.length % 2 !== 0) end = 10 ** (end.length - 1) - 1;
  return [start, end].map(Number);
};

const findInvalidIDsInRange = (range) => {
  const [start, end] = clampToEvenNumbers(range);

  let checksum = 0;

  let i = start;

  search: while (true) {
    i++;
    if (i > end) break;

    const curNumber = String(i);
    let a = 0;
    let b = curNumber.length / 2;

    for (let j = 0; j < curNumber.length / 2; j++) {
      if (curNumber[a + j] !== curNumber[b + j]) continue search;
    }

    checksum += Number(curNumber);
  }

  return checksum;
};

console.log(`Part 1: ${inputData.reduce((acc, cur) => acc + findInvalidIDsInRange(cur), 0)}`);
