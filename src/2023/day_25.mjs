import * as fs from 'node:fs';

const parse = (data) => {
  const [name, connections] = data.split(': ');
  return { name, connected: connections.split(' ') };
};

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(parse)
  .reduce((acc, cur) => ({ ...acc, [cur.name]: { name: cur.name, connected: new Set(cur.connected) } }), {});

const buildFullGraph = () => {
  Object.keys(inputData).forEach(node => {
    inputData[node].connected.forEach(connectionNode => {
      if (!inputData[connectionNode]) {
        inputData[connectionNode] = { name: connectionNode, connected: new Set([node]) };
      } else {
        inputData[connectionNode].connected.add(node);
      }
    });
  });
};

const findShortestPath = (graph, startNode, endNode) => {
  const queue = [[startNode]];
  const visited = new Set([startNode]);

  while (queue.length > 0) {
    const currentPath = queue.shift();
    const currentNode = currentPath[currentPath.length - 1];
    if (currentNode === endNode) return currentPath;
    for (const neighbor of graph[currentNode].connected) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...currentPath, neighbor]);
      }
    }
  }
  return [];
};

/*
   https://www.praxisframework.org/en/library/monte-carlo-analysis#:~:text=Monte%20Carlo%20analysis%20uses%20a,probabilities%20for%20a%20project%20schedule.
   Generate random pairs of connections and see what edges get passed through the most until I find them.
   The ones that connect the two sets should be the ones being passed through the most.
 */

const edges = {};
const countEdges = (path) => {
  path.forEach((node, index) => {
    if (index >= path.length - 1) return;
    const [nodeA, nodeB] = [node, path[index + 1]].toSorted();
    const edge = `${nodeA}-${nodeB}`;
    if (!edges[edge]) edges[edge] = { nodeA, nodeB, count: 0 };
    edges[edge].count += 1;
  });
};

const getRandomNode = (graph) => {
  const nodes = Object.keys(graph);
  return nodes[Math.floor(Math.random() * nodes.length)];
};

const simulateRandomPairs = (count) => {
  for (let i = 0; i < count; i++) {
    const nodeA = getRandomNode(inputData);
    const nodeB = getRandomNode(inputData);
    const path = findShortestPath(inputData, nodeA, nodeB);
    countEdges(path);
  }
};

const topCandidates = (count) => Object.values(edges).toSorted((a, b) => b.count - a.count).slice(0, count);

const getGraphWithoutEdges = (edges) => {
  const graph = {};
  for (const [node, data] of Object.entries(inputData)) {
    graph[node] = { name: data.name, connected: new Set(data.connected) };
  }
  for (const edge of edges) {
    graph[edge.nodeA].connected.delete(edge.nodeB);
    graph[edge.nodeB].connected.delete(edge.nodeA);
  }
  return graph;
};

function findConnectedGroup(graph) {
  const startNode = getRandomNode(graph);
  const unvisitedNodes = new Set(Object.keys(graph));
  const visitedNodes = new Set;
  const stack = [];
  stack.push(startNode);
  while (stack.length > 0) {
    const newNode = stack.pop();
    unvisitedNodes.delete(newNode);
    visitedNodes.add(newNode);
    graph[newNode].connected.forEach(targetNode => {
      if (!visitedNodes.has(targetNode)) stack.push(targetNode);
    });
  }
  return { visitedNodes, unvisitedNodes };
}

const findClusters = () => {
  simulateRandomPairs(250);
  const graph = getGraphWithoutEdges(topCandidates(3));
  const group1 = findConnectedGroup(graph);
  if (group1.unvisitedNodes.size === 0) findClusters();
  return { cluster1: group1.visitedNodes.size, cluster2: group1.unvisitedNodes.size };
};

buildFullGraph();
const { cluster1, cluster2 } = findClusters();
console.log(`Part 1: ${cluster1 * cluster2}`);
