import { readFileSync } from 'node:fs';
import { createHash } from 'crypto';

const passcode = readFileSync('input.txt', 'utf-8').trim();

const hexMap = Object.fromEntries(Array.from({ length: 16 }, (_, i) => [i.toString(16), i > 10]));

const getDoorState = (path) => createHash('md5')
  .update(`${passcode}${path}`)
  .digest('hex')
  .substring(0, 4)
  .split('')
  .map(c => hexMap[c]);

const dirMap = [['U', [0, -1]], ['D', [0, 1]], ['L', [-1, 0]], ['R', [1, 0]]];

const findPath = () => {
  const queue = [[0, 0, '']];

  let shortestPath;
  let longestPathLength = 0;

  while (queue.length) {
    const [x, y, path] = queue.shift();
    const doors = getDoorState(path);

    if (x === 3 && y === 3) {
      if (!shortestPath) shortestPath = path;
      longestPathLength = Math.max(longestPathLength, path.length);
      continue;
    }

    dirMap.forEach(([dir, [dx, dy]], i) => {
      const [newX, newY] = [x + dx, y + dy];
      if (!doors[i] || newX < 0 || newX > 3 || newY < 0 || newY > 3) return;
      queue.push([newX, newY, path + dir]);
    });
  }

  return { shortestPath, longestPathLength };
};

const { shortestPath, longestPathLength } = findPath();

console.log(`Part 1: ${shortestPath}`);
console.log(`Part 2: ${longestPathLength}`);
