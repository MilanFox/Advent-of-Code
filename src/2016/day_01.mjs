import { readFileSync } from 'node:fs';

const instructions = readFileSync('input.txt', 'utf-8')
  .trim()
  .split(', ')
  .map(instr => [instr.substring(0, 1), Number(instr.substring(1))]);

const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const rotation = { R: 1, L: -1 };

const getManhattanDistance = ({ x, y }) => Math.abs(x) + Math.abs(y);
const circleMod = (value, mod) => ((value % mod) + mod) % mod;

const walk = () => {
  const currentPos = { x: 0, y: 0 };
  let currentDir = 0;

  for (const [rotDir, distance] of instructions) {
    currentDir = circleMod(currentDir + rotation[rotDir], 4);
    const [dx, dy] = directions[currentDir];
    currentPos.x += distance * dx;
    currentPos.y += distance * dy;
  }

  return currentPos;
};

const finalPosition = walk();
console.log(`Part 1: ${getManhattanDistance(finalPosition)}`);
