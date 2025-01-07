import fs from 'node:fs';

const instructions = fs.readFileSync('input.txt', 'utf-8').trim().split('\n');
const lights = Array(1000).fill(0n);

// https://medium.com/@parkerjmed/practical-bit-manipulation-in-javascript-bfd9ef6d6c30
const operations = {
  on: (mask, y) => lights[y] |= mask,
  off: (mask, y) => lights[y] &= ~mask,
  toggle: (mask, y) => lights[y] ^= mask,
};

instructions.forEach(instr => {
  const [_, cmd, start, end] = (/(\w+)\s([\d,]+)\sthrough\s([\d,]+)/g).exec(instr);
  const [xStart, yStart] = start.split(',').map(Number);
  const [xEnd, yEnd] = end.split(',').map(Number);
  const mask = ((1n << BigInt(xEnd - xStart + 1)) - 1n) << BigInt(xStart);
  for (let y = yStart; y <= yEnd; y++) operations[cmd](mask, y);
});

const numberOfActiveLamps = lights.flatMap(row => [...row.toString(2)].filter(light => light === '1')).length;

console.log(`Part 1: ${numberOfActiveLamps}`);
