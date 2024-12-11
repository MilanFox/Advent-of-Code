import fs from 'node:fs';

let stones = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split(' ')
  .reduce((acc, cur) => ({ ...acc, [cur]: (acc[cur] ?? 0) + 1 }), {});

const getTotalStoneCount = () => Object.values(stones).reduce((acc, cur) => acc + cur, 0);

const blink = (count) => {
  for (let i = 0; i < count; i++) {
    const _stones = {};

    for (const [inscription, quantity] of Object.entries(stones)) {
      if (inscription === '0') {
        _stones['1'] = quantity;
        continue;
      }

      const digits = inscription.toString();
      if (digits.length % 2 === 0) {
        const pointerA = Number(digits.substring(0, digits.length / 2));
        const pointerB = Number(digits.substring(digits.length / 2));
        _stones[pointerA] = _stones[pointerA] ? _stones[pointerA] + quantity : quantity;
        _stones[pointerB] = _stones[pointerB] ? _stones[pointerB] + quantity : quantity;
        continue;
      }

      const multPointer = Number(inscription) * 2024;
      _stones[multPointer] = _stones[multPointer] ? _stones[multPointer] + quantity : quantity;
    }

    stones = _stones;
  }
};

blink(25);
console.log(`Part 1: ${getTotalStoneCount()}`);

blink(50);
console.log(`Part 2: ${getTotalStoneCount()}`);
