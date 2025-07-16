import { readFileSync } from 'node:fs';
import crypto from 'crypto';

const salt = readFileSync('input.txt', 'utf-8').trim();

const getKey = (desiredIndex) => {
  const getInfo = (i) => {
    let a = 0;
    let b = 1;

    let triplet;
    const quintuplets = new Set();

    const hash = crypto.createHash('md5').update(`${salt}${i}`).digest('hex');

    while (b < hash.length) {
      if (hash[a] !== hash[b]) {
        a = b;
        b += 1;
      } else {
        if (b - a === 2 && !triplet) triplet = hash[a];
        if (b - a === 4) quintuplets.add(hash[a]);
        b += 1;
      }
    }

    return { triplet, quintuplets };
  };

  const memo = Array.from({ length: 1001 }, (_, i) => getInfo(i));
  let i = 0;
  const foundKeys = new Set();

  while (true) {
    if (foundKeys.size >= desiredIndex) break;

    const triplet = memo[i].triplet;
    if (triplet === undefined) {
      i += 1;
      memo[i + 1000] = getInfo(i + 1000);
      continue;
    }

    if (memo.slice(i + 1, i + 1001).some(({ quintuplets }) => quintuplets.has(triplet))) foundKeys.add(i);

    i += 1;
    memo[i + 1000] = getInfo(i + 1000);
  }

  return i - 1;
};

console.log(`Part 1: ${(getKey(64))}`);
