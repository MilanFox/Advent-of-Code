import { readFileSync } from 'node:fs';

const inputData = readFileSync('testInput.txt', 'utf-8').trim().split(',').map(line => line.split('-'));

const clampToEvenNumbers = (range) => {
  let [start, end] = range;
  if (start.length % 2 !== 0) start = 10 ** start.length;
  if (end.length % 2 !== 0) end = 10 ** (end.length - 1) - 1;
  return [start, end].map(Number);
};

const findInvalidIDsInRange = (range) => {
  const [start, end] = clampToEvenNumbers(range);

  const invalidIDs = [];

  let i = start;

  search: while (true) {
    if (i > end) break;

    const curNumber = String(i);
    let a = 0;
    let b = curNumber.length / 2;

    for (let j = 0; j < curNumber.length / 2; j++) {
      if (curNumber[a] !== curNumber[b]) {
        i++; // skip i further
        continue search;
      }
    }

    i++;
    invalidIDs.push(curNumber);
  }

  return invalidIDs;
};

console.log(findInvalidIDsInRange(inputData[0])); //?
