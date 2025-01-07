import fs from 'node:fs';

class Edge {
  constructor(data) {
    const [from, _, to, __, weight] = data.split(' ');
    this.from = from;
    this.to = to;
    this.weight = parseInt(weight);
  }

  get locations() { return [this.from, this.to];}
}

class Graph {
  constructor(data) {
    const edges = data.map(line => new Edge(line));
    const nodes = [...new Set(edges.flatMap(connection => connection.locations))];

    this.nodes = nodes.reduce((acc, cur) => ({ ...acc, [cur]: {} }), {});
    this.destinations = nodes;

    edges.forEach(({ from, to, weight }) => {
      this.nodes[from][to] = weight;
      this.nodes[to][from] = weight;
    });
  }

  getShortestPath() {
    let shortestPath = Infinity;

    const queue = Object.keys(this.nodes).map(key => [key, [], 0]);

    while (queue.length) {
      queue.sort((a, b) => a[2] - b[2]);
      const [currentNode, visited, currentCost] = queue.shift();
      visited.push(currentNode);
      const nextDestinations = this.destinations.filter(dest => !visited.includes(dest));
      if (nextDestinations.length === 0) {
        shortestPath = Math.min(shortestPath, currentCost);
        continue;
      }
      if (currentCost >= shortestPath) continue;
      nextDestinations.forEach(dest => queue.push([dest, [...visited], currentCost + this.nodes[currentNode][dest]]));
    }

    return shortestPath;
  }

  getLongestPath() {
    let longestPath = -Infinity;

    const queue = Object.keys(this.nodes).map(key => [key, [], 0]);

    while (queue.length) {
      queue.sort((a, b) => a[2] - b[2]);
      const [currentNode, visited, currentCost] = queue.shift();
      visited.push(currentNode);
      const nextDestinations = this.destinations.filter(dest => !visited.includes(dest));
      if (nextDestinations.length === 0) {
        longestPath = Math.max(longestPath, currentCost);
        continue;
      }
      nextDestinations.forEach(dest => queue.push([dest, [...visited], currentCost + this.nodes[currentNode][dest]]));
    }

    return longestPath;
  }
}

const graph = new Graph(fs.readFileSync('input.txt', 'utf-8').trim().split('\n'));

console.log(`Part 1: ${graph.getShortestPath()}`);
console.log(`Part 2: ${graph.getLongestPath()}`); // runs nearly 30 secs - needs optimization

