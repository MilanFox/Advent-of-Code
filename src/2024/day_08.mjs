import fs from 'fs';

const map = fs.readFileSync('testInput.txt', 'utf-8').trim().split('\n').map(row => row.split(''));

const nodes = map.reduce((count, row, y) => row.reduce((_, cell, x) => {
  if (cell !== '.') (count[cell] ??= []).push({ x, y });
  return count;
}, ''), {});

const isInBounds = ({ x, y }) => y >= 0 && y < map.length && x >= 0 && x < map[0].length;

const getAntiNodes = (nodes) => {
  const antiNodes = new Set([]);
  for (let a = 0; a < nodes.length; a++) {
    for (let b = a + 1; b < nodes.length; b++) {
      const [vectorX, vectorY] = [nodes[b].x - nodes[a].x, nodes[b].y - nodes[a].y];
      const dirs = [{ dir: -1, node: nodes[a] }, { dir: 1, node: nodes[b] }];
      dirs.forEach(({ dir, node }) => {
        const x = node.x + (vectorX * dir);
        const y = node.y + (vectorY * dir);
        if (isInBounds({ x, y })) antiNodes.add(`${x}|${y}`);
      });
    }
  }
  return [...antiNodes];
};

const allAntiNodes = new Set(Object.values(nodes).flatMap(getAntiNodes));

console.log(`Part 1: ${allAntiNodes.size}`);
