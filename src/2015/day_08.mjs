import fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => data);

const getMemorySpace = (string) => {
  let space = 0;
  for (let i = 1; i < string.length - 1; i++) {
    if (string[i] === '\\') {
      if (string[i + 1] === '\\' || string[i + 1] === '"') i++;
      else if (string[i + 1] === 'x') i += 3;
    }
    space++;
  }
  return space;
};

const checksum = inputData.reduce((acc, cur) => acc + (cur.length - getMemorySpace(cur)), 0);

console.log(`Part 1: ${checksum}`);
