import * as fs from 'node:fs';

class Node {
  constructor([x, y], riskLevel) {
    this.name = `X${x}|Y${y}`;
    this.riskLevel = riskLevel;
    this.x = x;
    this.y = y;
    this.neighbors = [];
  }
}

class Graph {
  constructor(nodes) {
    this.grid = nodes;
    this.buildGraph();
  }

  addEdge(node1, node2) {
    node1.neighbors.push(node2);
  }

  buildGraph() {
    const directions = {
      'N': { offsetX: 0, offsetY: -1 },
      'E': { offsetX: 1, offsetY: 0 },
      'S': { offsetX: 0, offsetY: 1 },
      'W': { offsetX: -1, offsetY: 0 },
    };

    const isInBounds = (matrix, { X, Y }) => Y >= 0 && Y < matrix.length && X >= 0 && X < matrix[0].length;

    const queue = [[0, 0]];
    const visited = new Set();

    while (queue.length > 0) {
      const [y, x] = queue.shift();
      const node = this.grid[y][x];

      if (visited.has(node.name)) continue;
      visited.add(node.name);

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

  get start() { return this.grid[0][0]; }

  get end() { return this.grid.at(-1).at(-1); }

  get safestPath() {
    const riskLevelMap = Array.from({ length: this.grid.length }, () => Array.from({ length: this.grid[0].length }, () => Number.MAX_SAFE_INTEGER));
    const priorityQueue = [{ node: this.start, riskLevel: 0 }];

    riskLevelMap[0][0] = 0;

    while (priorityQueue.length > 0) {
      priorityQueue.sort((a, b) => a.riskLevel - b.riskLevel);
      const { node: currentNode, riskLevel: currentRiskLevel } = priorityQueue.shift();

      if (currentNode === this.end) {
        return currentRiskLevel;
      }

      for (const neighbor of currentNode.neighbors) {
        const newRiskLevel = currentRiskLevel + neighbor.riskLevel;
        const { x, y } = neighbor;

        if (newRiskLevel < riskLevelMap[y][x]) {
          riskLevelMap[y][x] = newRiskLevel;
          priorityQueue.push({ node: neighbor, riskLevel: newRiskLevel });
        }
      }
    }
  }
}

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n');

const nodes = inputData.map((row, y) => row.split('').map((cell, x) => new Node([x, y], parseInt(cell))));
const map = new Graph(nodes);
console.log(`Part 1: ${map.safestPath}`);

const allNodes = Array
  .from({ length: inputData.length * 5 }, (_, i) => Array
    .from({ length: inputData[0].length * 5 }, (_, j) => (parseInt(inputData[i % inputData.length][j % inputData[0].length]) + Math.floor(i / inputData.length) + Math.floor(j / inputData[0].length)) % 9)
    .map(n => n === 0 ? 9 : n)
    .join(''))
  .map((row, y) => row.split('').map((cell, x) => new Node([x, y], parseInt(cell))));
const fullMap = new Graph(allNodes);
console.log(`Part 2: ${fullMap.safestPath}`);
