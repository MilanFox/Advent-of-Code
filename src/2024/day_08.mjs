import fs from 'fs';

const map = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(row => row.split(''));

const nodes = map.reduce((count, row, y) => row.reduce((_, cell, x) => {
  if (cell !== '.') (count[cell] ??= []).push({ x, y });
  return count;
}, ''), {});

const isInBounds = ({ x, y }) => y >= 0 && y < map.length && x >= 0 && x < map[0].length;

const getAntiNodes = (nodes, { startingDistance, maxNodes } = {}) => {
  const antiNodes = new Set([]);
  for (let a = 0; a < nodes.length; a++) {
    for (let b = a + 1; b < nodes.length; b++) {
      const [vectorX, vectorY] = [nodes[b].x - nodes[a].x, nodes[b].y - nodes[a].y];
      const dirs = [{ dir: -1, node: nodes[a] }, { dir: 1, node: nodes[b] }];
      dirs.forEach(({ dir, node }) => {
        let distance = startingDistance;
        let count = 0;
        while (true) {
          const x = node.x + ((vectorX * distance) * dir);
          const y = node.y + ((vectorY * distance) * dir);
          if (!isInBounds({ x, y }) || count >= maxNodes) break;
          antiNodes.add(`${x}|${y}`);
          distance += 1;
          count += 1;
        }
      });
    }
  }
  return [...antiNodes];
};

const getAllAntiNodes = (options) => new Set(Object.values(nodes).flatMap(node => getAntiNodes(node, options)));

const neighboringAntiNodes = getAllAntiNodes({ startingDistance: 1, maxNodes: 1 });
console.log(`Part 1: ${neighboringAntiNodes.size}`);

const allAntiNodes = getAllAntiNodes({ startingDistance: 0, maxNodes: Infinity });
console.log(`Part 2: ${allAntiNodes.size}`);
