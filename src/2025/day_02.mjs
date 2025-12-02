import { readFileSync } from 'node:fs';

const inputData = readFileSync('input.txt', 'utf-8').trim().split(',').map(line => line.split('-').map(Number));

const isInvalid = (num, segmentLength) => {
  for (let i = 0; i < segmentLength; i++) {
    for (let j = 0; j < num.length / segmentLength; j++) {
      if (num[i] !== num[i + (j * segmentLength)]) return false;
    }
  }
  return true;
};

const twoWaySymmetryChecksum = inputData.reduce((acc, [start, end]) => {
  for (let i = start; i <= end; i++) {
    const num = String(i);
    if (num.length % 2 === 0 && isInvalid(num, num.length / 2)) acc += i;
  }
  return acc;
}, 0);

console.log(`Part 1: ${twoWaySymmetryChecksum}`);

const nWaySymmetryChecksum = inputData.reduce((acc, [start, end]) => {
  search: for (let i = start; i <= end; i++) {
    const num = String(i);
    for (let j = 1; j <= num.length / 2; j++) {
      if (num.length % j === 0 && isInvalid(num, j)) {
        acc += i;
        continue search;
      }
    }
  }
  return acc;
}, 0);

console.log(`Part 2: ${nWaySymmetryChecksum}`);
