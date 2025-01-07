import fs from 'node:fs';
import crypto from 'crypto';

const inputString = fs.readFileSync('input.txt', 'utf-8').trim();

const mineBlock = (n) => {
  let i = 0;
  while (true) {
    const hash = crypto.createHash('md5').update(`${inputString}${i}`).digest('hex');
    if (hash.startsWith('0'.repeat(n))) return i;
    i++;
  }
};

console.log(`Part 1: ${mineBlock(5)}`);
console.log(`Part 2: ${mineBlock(6)}`);
