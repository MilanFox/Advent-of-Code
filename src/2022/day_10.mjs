import * as fs from 'node:fs';

let instructions = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(instruction => instruction.split(' '));

let register = 1;
let cycle = 0;
let signalStrength = 0;
const screen = Array.from({ length: 6 }, () => Array.from({ length: 40 }, () => ' '));

const tryDrawPixel = () => {
  const y = Math.floor(cycle / 40);
  const x = cycle % 40 - 1;
  if (register >= x - 1 && register <= x + 1) {
    screen[y][x] = '█';
  }
};

const incrementCycle = () => {
  cycle += 1;
  if (cycle <= 220 && (cycle + 20) % 40 === 0) signalStrength += cycle * register;
  tryDrawPixel();
};

const addValue = (value) => {
  incrementCycle();
  register += parseInt(value, 10);
};

instructions.forEach(([op, value]) => {
  incrementCycle();
  if (op === 'noop') return;
  addValue(value);
});

console.log(`Part 1: ${signalStrength}`);

fs.writeFileSync('visualization.txt', screen.map(line => line.join('')).join('\n'), { flag: 'w+' });
console.log(`Part 2: Screen drawn, check 'visualization.txt'!`);
