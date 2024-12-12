import fs from 'node:fs';

let stones = fs
  .readFileSync('input.txt', 'utf-8').trim().split(' ')
  .reduce((acc, cur) => ({ ...acc, [cur]: (acc[cur] ?? 0) + 1 }), {});

const getTotalStoneCount = () => Object.values(stones).reduce((acc, cur) => acc + cur, 0);

const blink = (count) => {
  for (let i = 0; i < count; i++) {
    const nextStones = {};

    for (const [inscription, quantity] of Object.entries(stones)) {
      if (inscription === '0') {
        nextStones['1'] = quantity;
        continue;
      }

      const digits = inscription.toString();
      if (digits.length % 2 === 0) {
        const leftHalf = Number(digits.substring(0, digits.length / 2));
        const rightHalf = Number(digits.substring(digits.length / 2));
        nextStones[leftHalf] = (nextStones[leftHalf] ?? 0) + quantity;
        nextStones[rightHalf] = (nextStones[rightHalf] ?? 0) + quantity;
        continue;
      }

      const nextInscription = Number(inscription) * 2024;
      nextStones[nextInscription] = (nextStones[nextInscription] ?? 0) + quantity;
    }

    stones = nextStones;
  }
};

blink(25);
console.log(`Part 1: ${getTotalStoneCount()}`);

blink(50);
console.log(`Part 2: ${getTotalStoneCount()}`);
