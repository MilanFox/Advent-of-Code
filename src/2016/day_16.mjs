import { readFileSync } from 'node:fs';

const inputData = readFileSync('input.txt', 'utf-8').trim().split((''));

const expand = (input, length) => {
  let string = [...input];
  while (string.length < length) string = [string, '0', string.map(n => n === '0' ? '1' : '0').reverse()].flat();
  return string.slice(0, length);
};

const getChecksum = (sequence) => {
  let checksum = [...sequence];
  while (checksum.length % 2 === 0) {
    checksum = Array.from({ length: checksum.length / 2 }, (_, i) => checksum[i * 2] === checksum[(i * 2) + 1] ? '1' : '0');
  }
  return checksum.join('');
};

const dragonString = expand(inputData, 272).join('');
const checksum = getChecksum(dragonString);

console.log(`Part 1: ${checksum}`);
