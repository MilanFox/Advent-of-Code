import fs from "fs";

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map(line => line.split(''));

const heightMap = [...'abcdefghijklmnopqrstuvwxyz'].reduce((acc, cur, i) => ({...acc, [cur]: i}), {S: 0, E:25});

const isInBounds = ({X, Y}) => Y >= 0 && Y < inputData.length && X >= 0 && X < inputData[0].length;

const directions = {
  'north': {offsetX: 0, offsetY: -1},
  'east': {offsetX: 1, offsetY: 0},
  'south': {offsetX: 0, offsetY: 1},
  'west': {offsetX: -1, offsetY: 0}
};

const buildGraph = () => {
  class Graph {
    constructor() {
      this.nodes = {};
    }

    addNode(name, height) {
      if (!this.nodes[name]) this.nodes[name] = {name, height, neighbors: []};
    }

    defineAsStart(name) {
      this.start = this.nodes[name];
    }

    defineAsEnd(name) {
      this.end = this.nodes[name];
    }

    addEdge(node1, node2) {
      this.nodes[node1].neighbors.push(node2);
    }
  }

  const graph = new Graph;

  for (let y = 0; y < inputData.length; y++) {
    for (let x = 0; x < inputData[0].length; x++) {
      const currentName = `${y}|${x}`;
      const currentValue = inputData[y][x];
      const currentHeight = heightMap[currentValue];
      graph.addNode(currentName, currentHeight);
      if (currentValue === 'S') graph.defineAsStart(currentName);
      if (currentValue === 'E') graph.defineAsEnd(currentName);

      Object.values(directions).forEach(({offsetX, offsetY}) => {
        const X = x + offsetX;
        const Y = y + offsetY;
        if (!isInBounds({X, Y})) return;
        const targetHeight = heightMap[inputData[Y][X]];
        const heightDifference = targetHeight - currentHeight;
        if (heightDifference <= 1) {
          graph.addEdge(currentName, `${Y}|${X}`);
        }
      })
    }
  }

  return graph;
}

const findShortestPath = (graph, startNode) => {
  const queue = [[startNode]];
  const visited = new Set([startNode.name]);

  while (queue.length > 0) {
    const currentPath = queue.shift();
    const currentNode = currentPath.at(-1);
    if (currentNode === graph.end) return currentPath.length - 1;
    for (const neighbor of currentNode.neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...currentPath, graph.nodes[neighbor]]);
      }
    }
  }

  return Number.MAX_VALUE;
}

const graph = buildGraph();
const shortestPath = findShortestPath(graph, graph.start);

console.log(`Part 1: ${shortestPath}`);

const shortestFromAnyA = Object
  .values(graph.nodes)
  .filter(node => node.height === 0)
  .reduce((acc, cur) => Math.min(acc, findShortestPath(graph, cur)), Number.MAX_VALUE);

console.log(`Part 2: ${shortestFromAnyA}`);
