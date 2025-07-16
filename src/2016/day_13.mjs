import { readFileSync } from 'node:fs';

const favoriteNumber = Number(readFileSync('input.txt', 'utf-8').trim());

const isEmpty = (x, y) => {
  const tileID = (x * x) + (3 * x) + (2 * x * y) + y + (y * y) + favoriteNumber;

  /* https://en.wikipedia.org/wiki/Hamming_weight */
  const getHammingWeight = (number) => {
    let count = 0;
    while (number) {
      number &= (number - 1);
      count++;
    }
    return count;
  };

  return getHammingWeight(tileID) % 2 === 0;
};

const getShortestPath = (tagetX, targetY) => {
  const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  const isInBounds = (x, y) => x >= 0 && y >= 0;
  const visited = new Set();
  const queue = [[1, 1, []]];

  while (queue.length) {
    const [x, y, prevPath] = queue.shift();

    const id = `${x}|${y}`;
    if (visited.has(id)) continue;
    visited.add(id);

    if (x === tagetX && y === targetY) return prevPath;

    directions.forEach(([dx, dy]) => {
      const X = x + dx;
      const Y = y + dy;
      if (visited.has(`${X}|${Y}`) || !isInBounds(X, Y) || !isEmpty(X, Y)) return;
      queue.push([X, Y, [...prevPath, id]]);
    });
  }
};

console.log(`Part 1: ${getShortestPath(31, 39).length}`);

const getAllReachableDestinations = (steps) => {
  const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  const isInBounds = (x, y) => x >= 0 && y >= 0;
  const visited = new Set();
  const reachable = [];
  const queue = [[1, 1, steps + 1]];

  while (queue.length) {
    const [x, y, prevSteps] = queue.shift();

    const id = `${x}|${y}`;
    if (visited.has(id)) continue;
    visited.add(id);
    reachable.push(id);

    const stepsLeft = prevSteps - 1;
    if (stepsLeft <= 0) continue;

    directions.forEach(([dx, dy]) => {
      const X = x + dx;
      const Y = y + dy;
      if (visited.has(`${X}|${Y}`) || !isInBounds(X, Y) || !isEmpty(X, Y)) return;
      queue.push([X, Y, stepsLeft]);
    });
  }

  return reachable;
};

console.log(`Part 2: ${getAllReachableDestinations(50).length}`);
