import { readFileSync } from 'node:fs';
import crypto from 'crypto';

// Progress Bar - Just for flair, since this is a very expensive calculation by design
const CLI = {
  updateLine: (text) => {
    process.stdout.write(text);
  },
  clearLine: () => {
    process.stdout.clearLine?.(0);
    process.stdout.cursorTo?.(0);
  },
  hideCursor: () => {
    process.stdout.write('\x1B[?25l');
  },
  showCursor: () => {
    process.stdout.write('\x1B[?25h');
  },
};

const salt = readFileSync('input.txt', 'utf-8').trim();

const getKey = ({ desiredIndex, stretchingFactor }) => {
  CLI.updateLine(`\r${'░'.repeat(13)}`);

  const getInfo = (i) => {
    let a = 0;
    let b = 1;

    let triplet;
    const quintuplets = new Set();

    let hash;
    for (let j = 0; j <= stretchingFactor; j++) {
      hash = crypto.createHash('md5').update(hash ?? `${salt}${i}`).digest('hex');
    }

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
    memo[i + 1000] = getInfo(i + 1000);

    const triplet = memo[i].triplet;
    if (triplet === undefined) {
      i += 1;
      continue;
    }

    if (memo.slice(i + 1, i + 1001).some(({ quintuplets }) => quintuplets.has(triplet))) foundKeys.add(i);
    if (foundKeys.size >= desiredIndex) break;
    CLI.updateLine(`\r${'█'.repeat(Math.floor(13 / desiredIndex * foundKeys.size))}${'░'.repeat(13 - Math.floor((13 / desiredIndex * foundKeys.size)))}`);

    i += 1;
  }

  CLI.clearLine();
  return i;
};

CLI.hideCursor();
console.log(`Part 1: ${(getKey({ desiredIndex: 64, stretchingFactor: 0 }))}`);
console.log(`Part 2: ${(getKey({ desiredIndex: 64, stretchingFactor: 2016 }))}`);
CLI.showCursor();
