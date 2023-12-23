import * as fs from 'node:fs';

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(line => line.split(''));

const start = { y: 0, x: inputData[0].findIndex(cell => cell === '.') };
const lastRow = inputData.length - 1;
const end = { y: lastRow, x: inputData[lastRow].findIndex(cell => cell === '.') };

const directions = {
  'north': { offsetX: 0, offsetY: -1 },
  'east': { offsetX: 1, offsetY: 0 },
  'south': { offsetX: 0, offsetY: 1 },
  'west': { offsetX: -1, offsetY: 0 },
};

const isInBounds = ({ x, y }) => y >= 0 && y < inputData.length && x >= 0 && x < inputData[0].length;

const buildGraph = ({ start, end, ignoreSlopes = false }) => {
  class Graph {
    constructor() {
      this.nodes = {};
    }

    addNode(name) {
      if (!this.nodes[name]) this.nodes[name] = {};
    }

    defineAsStart(name) {
      this.start = name;
    }

    defineAsEnd(name) {
      this.end = name;
    }

    addEdge({ node1, node2, weight, directed }) {
      if (!directed) this.nodes[node1][node2] = weight;
      this.nodes[node2][node1] = weight;
    }

    getNeighbors(node) {
      return Object.entries(this.nodes[node]);
    }
  }

  const graph = new Graph;
  const stack = [];
  stack.push([start, 0]);
  const visitedNodes = new Set;

  while (stack.length > 0) {
    let [{ x, y }, stepsTaken, visitedTiles = [], lastVisitedNode, directed = false] = stack.pop();
    visitedTiles = [...visitedTiles];
    const currentTile = `${y}-${x}`;

    if (!lastVisitedNode) {
      graph.addNode(currentTile);
      graph.defineAsStart(currentTile);
      lastVisitedNode = currentTile;
    }

    if (x === end.x && y === end.y) {
      graph.addNode(currentTile);
      graph.addEdge({ node1: currentTile, node2: lastVisitedNode, weight: stepsTaken, directed });
      graph.defineAsEnd(currentTile);
      continue;
    }

    let neighbors = Object
      .entries(directions)
      .map(([dir, { offsetX, offsetY }]) => ({ x: x + offsetX, y: y + offsetY, dir }))
      .filter(({ x, y }) => !visitedTiles.includes(`${y}-${x}`) && isInBounds({ x, y }) && inputData[y][x] !== '#');

    visitedTiles.push(currentTile);

    if (!ignoreSlopes && (inputData[y][x] === '>' || inputData[y][x] === 'v')) {
      const onlyLegalDir = inputData[y][x] === '>' ? 'east' : 'south';
      neighbors = neighbors.filter(neighbor => neighbor.dir === onlyLegalDir);
      directed = true;
    }

    if (neighbors.length > 1) {
      graph.addNode(currentTile);
      graph.addEdge({ node1: currentTile, node2: lastVisitedNode, weight: stepsTaken, directed });
      stepsTaken = 0;
      lastVisitedNode = currentTile;
      directed = false;
      if (visitedNodes.has(currentTile)) continue;
      visitedNodes.add(currentTile);
    }

    neighbors.forEach(({ x, y }) => {
      stack.push([{ x, y }, stepsTaken + 1, visitedTiles, lastVisitedNode, directed]);
    });
  }

  return graph;
};

const findMostScenicRoute = (graph) => {
  const stack = [];
  stack.push([graph.start]);
  let longestPath = 0;

  while (stack.length > 0) {
    const [currentNode, stepsTaken = 0, visitedNodes = []] = stack.pop();
    const neighbors = graph.getNeighbors(currentNode);

    if (currentNode === graph.end) {
      longestPath = Math.max(stepsTaken, longestPath);
      continue;
    }

    neighbors.forEach(([neighbor, distance]) => {
      if (!visitedNodes.includes(neighbor)) stack.push([neighbor, stepsTaken + distance, [...visitedNodes, currentNode]]);
    });
  }

  return longestPath;
};

const graphWithSlopes = buildGraph({ start, end });
console.log(`Part 1: ${findMostScenicRoute(graphWithSlopes)}`);

const graphWithoutSlopes = buildGraph({ start, end, ignoreSlopes: true });
console.log(`Part 2: ${findMostScenicRoute(graphWithoutSlopes)}`);
