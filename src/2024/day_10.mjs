import fs from 'node:fs';

const hikingMap = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(row => row.split('').map(Number));

const trailHeads = hikingMap.reduce((acc, row, y) =>
  row.reduce((_, cell, x) => {
    if (cell === 0) acc.push({ x, y });
    return acc;
  }, acc), []);

const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

const getScore = (trailHead) => {
  const queue = [trailHead];
  const peaks = new Set([]);

  while (queue.length) {
    const { x, y } = queue.shift();

    if (hikingMap[y][x] === 9) {
      peaks.add(`${x}|${y}`);
      continue;
    }

    for (const [offsetX, offsetY] of directions) {
      const _x = x + offsetX;
      const _y = y + offsetY;

      if (!(hikingMap[_y]?.[_x] - hikingMap[y][x] === 1)) continue;
      queue.push({ x: _x, y: _y });
    }
  }

  return peaks.size;
};

const hikingScore = trailHeads.reduce((acc, cur) => acc + getScore(cur), 0);
console.log(`Part 1: ${hikingScore}`);

