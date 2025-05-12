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
  const visited = new Set(`0|0`);
  const currentPos = { x: 0, y: 0 };
  let currentDir = 0;
  let firstRepeatedPosition;

  for (const [rotDir, distance] of instructions) {
    currentDir = circleMod(currentDir + rotation[rotDir], 4);
    const [dx, dy] = directions[currentDir];

    for (let step = 0; step < distance; step++) {
      currentPos.x += dx;
      currentPos.y += dy;
      const posHash = `${currentPos.x}|${currentPos.y}`;
      if (firstRepeatedPosition) continue;
      if (visited.has(posHash)) firstRepeatedPosition = { ...currentPos };
      visited.add(posHash);
    }
  }

  return { finalPosition: currentPos, firstRepeatedPosition };
};

const { finalPosition, firstRepeatedPosition } = walk();

console.log(`Part 1: ${getManhattanDistance(finalPosition)}`);
console.log(`Part 2: ${getManhattanDistance(firstRepeatedPosition)}`);
