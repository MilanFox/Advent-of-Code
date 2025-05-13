import { readFileSync } from 'node:fs';

const instructions = readFileSync('input.txt', 'utf-8').trim().split('\n');

const screen = Array.from({ length: 6 }, () => Array.from({ length: 50 }, () => false));

const circleMod = (value, mod) => ((value % mod) + mod) % mod;

for (const instruction of instructions) {
  if (instruction.startsWith('rect')) {
    const [width, height] = instruction.match(/\d+/g).map(Number);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        screen[y][x] = true;
      }
    }
    continue;
  }
  if (instruction.startsWith('rotate row')) {
    const [index, offset] = instruction.match(/\d+/g).map(Number);
    screen[index] = Array.from({ length: 50 }, (_, i) => screen[index][circleMod(50 - offset + i, 50)]);
    continue;
  }
  if (instruction.startsWith('rotate column')) {
    const [index, offset] = instruction.match(/\d+/g).map(Number);
    const shiftedCol = Array.from({ length: 6 }, (_, i) => screen[circleMod(6 - offset + i, 6)][index]);
    for (let i = 0; i < 6; i++) screen[i][index] = shiftedCol[i];
  }
}

const checksum = screen.flat().filter(Boolean).length;

console.log(`Part 1: ${checksum}`);
console.log(`Part 2:\n${screen.map(row => row.map(isLit => isLit ? '█' : ' ').join('')).join('\n')}`);
