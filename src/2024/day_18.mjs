import fs from 'fs';

const bytes = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => data.split(',').map(Number));

const findCheapestPath = ({ size, fixedTime }) => {
  const isInBounds = ({ x, y }) => y >= 0 && y < size && x >= 0 && x < size;
  const memo = {};
  const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  const prioQueue = [[0, 0, 0, 2 * (size - 1)]];

  while (prioQueue.length) {
    prioQueue.sort((a, b) => a[3] - b[3]);
    const [x, y, steps] = prioQueue.shift();

    const key = `${x}|${y}`;
    if (memo[key] !== undefined && memo[key] <= steps) continue;
    memo[key] = steps;

    if (x === size - 1 && y === size - 1) return steps;

    for (const [dx, dy] of directions) {
      const targetX = x + dx;
      const targetY = y + dy;

      if (bytes.slice(0, fixedTime).find(([X, Y]) => X === targetX && Y === targetY)) continue;
      if (!isInBounds({ x: targetX, y: targetY })) continue;

      const manhattanDistance = ((size - 1) - targetX) + ((size - 1) - targetY);
      prioQueue.push([targetX, targetY, steps + 1, steps + 1 + manhattanDistance]);
    }
  }

  return null;
};

console.log(`Part 1: ${findCheapestPath({ size: 71, fixedTime: 1024 })}`);


