import * as fs from 'node:fs';

class Cave {
  constructor(name) {
    this.name = name;
    this.isBig = name.toUpperCase() === name;
    this.neighbors = [];
  }
}

class CaveSystem {
  constructor(paths) {
    this.caves = {};
    this.buildMap(paths);
  }

  tryAddCave(name) {
    if (!this.caves[name]) this.caves[name] = new Cave(name);
  }

  addEdge(node1, node2) {
    this.caves[node1.name].neighbors.push(node2);
    this.caves[node2.name].neighbors.push(node1);
  }

  buildMap(paths) {
    paths.forEach(([cave1, cave2]) => {
      this.tryAddCave(cave1);
      this.tryAddCave(cave2);
      this.addEdge(this.caves[cave1], this.caves[cave2]);
    });
  }
}

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => data.split('-'));
const caveSystem = new CaveSystem(inputData);

const findAllPaths = () => {
  const potentialPaths = [];
  const queue = [{ cave: caveSystem.caves.start, visited: [] }];

  while (queue.length) {
    const { cave: currentCave, visited, duplicateCave } = queue.shift();

    if (currentCave === caveSystem.caves.end) {
      potentialPaths.push({ visited: [...visited, currentCave], duplicateCave });
      continue;
    }

    for (const cave of currentCave.neighbors) {
      if (cave.isBig || !visited.includes(cave)) {
        queue.push({ cave, visited: [...visited, currentCave], duplicateCave });
        continue;
      }

      if (!duplicateCave && cave.name !== 'start') {
        queue.push({ cave, visited: [...visited, currentCave], duplicateCave: true });
      }
    }
  }

  return potentialPaths;
};

const legalPaths = findAllPaths();
console.log(`Part 1: ${legalPaths.filter(path => !path.duplicateCave).length}`);
console.log(`Part 2: ${legalPaths.length}`);

