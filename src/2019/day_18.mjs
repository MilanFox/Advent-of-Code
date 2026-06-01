import { readFileSync } from 'node:fs';

const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

const type = {
  START: 'start',
  KEY: 'key',
  DOOR: 'door',
};

class Node {
  constructor(x, y, map) {
    this.x = x;
    this.y = y;
    this.value = map[y][x];
    this.neighbours = [];

    if (this.value === '@') this.type = type.START;

    if (this.value.match(/[a-z]/)) {
      this.type = type.KEY;
      this.bitmask = 1 << this.value.charCodeAt(0) - 97;
    }

    if (this.value.match(/[A-Z]/)) {
      this.type = type.DOOR;
      this.bitmask = 1 << this.value.charCodeAt(0) - 65;
    }
  }

  findNeighbours(map, nodes) {
    const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    const visited = new Set([`${this.x}|${this.y}`]);
    const queue = dirs.map(([dx, dy]) => [[this.x + dx, this.y + dy], 1]);

    while (queue.length) {
      const [[x, y], stepsTaken] = queue.shift();

      const hash = `${x}|${y}`;
      if (visited.has(hash)) continue;
      visited.add(hash);

      const cell = map[y][x];

      if (cell === '#') continue;

      if (cell === '.') {
        queue.push(...dirs.map(([dx, dy]) => [[x + dx, y + dy], stepsTaken + 1]));
        continue;
      }

      this.neighbours.push({ node: nodes[cell], weight: stepsTaken });
    }
  };
}

class Map {
  #map;

  constructor(mapData) {
    this.#map = mapData.trim().split('\n').map(line => line.split(''));

    this.nodes = this.#map.reduce((acc, curLine, y) => {
      const nodeInLine = curLine.reduce((lineAcc, curCell, x) => {
        if (curCell !== '#' && curCell !== '.') lineAcc.push(new Node(x, y, this.#map, this.nodes));
        return lineAcc;
      }, []);

      nodeInLine.forEach(node => acc[node.value] = node);

      return acc;
    }, {});

    let numberOfKeys = 0;

    Object.values(this.nodes).forEach(node => {
      node.findNeighbours(this.#map, this.nodes);
      if (node.type === type.KEY) numberOfKeys += 1;
    });

    this.winState = (1 << numberOfKeys) - 1;
  }

  get fastestKeyRoute() {
    const start = this.nodes['@'];
    const visited = {};

    const queue = start.neighbours.map(({ node, weight }) => ({ node, steps: weight, keys: 0 }));
    visited[`@-0`] = 0;

    let fastestRoute = Infinity;

    while (queue.length) {
      let { node, steps, keys } = queue.shift();

      if (steps >= fastestRoute) continue;

      const hash = `${node.value}-${keys}`;
      if (visited[hash] <= steps) {
        continue;
      } else {
        visited[hash] = steps;
      }

      if (node.type === type.KEY) {
        keys |= node.bitmask;
        if (keys === this.winState) {
          fastestRoute = Math.min(fastestRoute, steps);
          continue;
        }
      }

      if (node.type === type.DOOR && !((keys & node.bitmask) === node.bitmask)) continue;

      node.neighbours.forEach(({ node: nextNode, weight }) => queue.push({
        node: nextNode,
        steps: steps + weight,
        keys,
      }));
    }

    return fastestRoute;
  }
}

const map = new Map(readFileSync('input.txt', 'utf-8'));

console.log(`Part 1: ${map.fastestKeyRoute}`);
