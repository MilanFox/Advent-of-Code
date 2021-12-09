import * as fs from 'node:fs';

class Node {
  constructor(name, height) {
    this.name = name;
    this.height = height;
    this.neighbors = [];
    if (height === 9) this.isPeak = true;
  }
}

class Graph {
  constructor(nodes) {
    this.grid = nodes;
    this.nodes = {};
    nodes.flat().forEach(node => this.addNode(node));
    this.buildGraph();
  }

  addNode(node) { if (!this.nodes[node.name]) this.nodes[node.name] = node; }

  addEdge(node1, node2) {
    this.nodes[node1.name].neighbors.push({ node: node2, weight: node2.height - node1.height });
  }

  buildGraph() {
    const directions = {
      'north': { offsetX: 0, offsetY: -1 },
      'east': { offsetX: 1, offsetY: 0 },
      'south': { offsetX: 0, offsetY: 1 },
      'west': { offsetX: -1, offsetY: 0 },
    };

    const isInBounds = (matrix, { X, Y }) => Y >= 0 && Y < matrix.length && X >= 0 && X < matrix[0].length;

    const queue = [[0, 0]];
    const visited = [];

    while (queue.length > 0) {
      const [y, x] = queue.shift();
      const node = this.grid[y][x];

      if (visited.includes(node.name)) continue;
      visited.push(node.name);

      for (const direction in directions) {
        const X = x + directions[direction].offsetX;
        const Y = y + directions[direction].offsetY;

        if (isInBounds(this.grid, { X, Y })) {
          this.addEdge(node, this.grid[Y][X]);
          queue.push([Y, X]);
        }
      }
    }
  }

  get nodeList() {
    return Object.values(this.nodes);
  }
}

const nodes = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map((row, y) => row.split('').map((cell, x) => new Node(`Y${y}|X${x}`, parseInt(cell))));

const map = new Graph(nodes);

const lowPoints = map.nodeList.filter(node => node.neighbors.every(({ weight }) => weight > 0));
const riskLevel = lowPoints.reduce((acc, cur) => acc + cur.height + 1, 0);

console.log(`Part 1: ${riskLevel}`);

const getBasinSize = (lowPoint) => {
  const queue = [lowPoint];
  const visited = [];

  while (queue.length) {
    const node = queue.shift();
    if (visited.includes(node) || node.isPeak) continue;

    visited.push(node);
    node.neighbors.forEach(neighbor => queue.push(neighbor.node));
  }

  return visited.length;
};

const basins = lowPoints.map(getBasinSize).sort((a, b) => b - a);

console.log(`Part 2: ${basins.slice(0, 3).reduce((acc, cur) => acc * cur, 1)}`);

// Visualize
lowPoints.forEach(node => node.isLowpoint = true);
const visualization = map.grid.map(row => row.map(cell => {
  if (cell.isPeak) return '█';
  if (cell.isLowpoint) return '○';
  return ' ';
}));
fs.writeFileSync('visualization.txt', visualization.map(line => line.join('')).join('\n'), { flag: 'w+' });
