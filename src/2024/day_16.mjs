import fs from 'node:fs';

const map = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(row => row.split(''));

const findStart = () => {
  const y = map.findIndex(row => row.includes('S'));
  const x = map[y].findIndex(cell => cell === 'S');
  return { x, y, dir: 1 };
};

const start = findStart();
const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const memo = {};

const findCheapestPath = (start) => {
  const prioQueue = [[start, 0]];

  while (prioQueue.length) {
    prioQueue.sort(([_, scoreA], [__, scoreB]) => scoreA - scoreB);
    const [{ x, y, dir }, localScore] = prioQueue.shift();

    if (map[y][x] === 'E') return localScore;

    const hash = `${x}|${y}|${dir}`;
    if (memo[hash] !== undefined && memo[hash] <= localScore) continue;
    memo[hash] = localScore;

    for (let turn = 0; turn < 3; turn++) {
      const newDir = (dir + (turn === 2 ? -1 : turn) + 4) % 4;
      const [dx, dy] = directions[newDir];
      const targetX = x + dx;
      const targetY = y + dy;

      if (map[targetY]?.[targetX] && map[targetY][targetX] !== '#') {
        const additionalScore = turn === 0 ? 1 : 1001;
        prioQueue.push([{ x: targetX, y: targetY, dir: newDir }, localScore + additionalScore]);
      }
    }
  }

  return null;
};

console.log(`Part 1: ${findCheapestPath(start)}`);
