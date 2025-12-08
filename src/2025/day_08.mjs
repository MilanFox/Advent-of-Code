import { readFileSync } from 'node:fs';

/**
 * https://javascript.plainenglish.io/union-find-97f0036dff93
 */
class UnionFind {
  constructor(elements) {
    this.elements = elements;
    this.indexMap = new Map();
    elements.forEach((el, i) => this.indexMap.set(el, i));
    this.parent = Array.from({ length: elements.length }, (_, i) => i);
    this.size = Array(elements.length).fill(1);
  }

  find(el) {
    const index = this.indexMap.get(el);
    if (this.parent[index] !== index) this.parent[index] = this.findByIndex(this.parent[index]);
    return this.parent[index];
  }

  findByIndex(index) {
    if (this.parent[index] !== index) this.parent[index] = this.findByIndex(this.parent[index]);
    return this.parent[index];
  }

  union([elementA, elementB]) {
    let groupA = this.find(elementA);
    let groupB = this.find(elementB);
    if (groupA === groupB) return;
    if (this.size[groupA] < this.size[groupB]) [groupA, groupB] = [groupB, groupA];
    this.parent[groupB] = groupA;
    this.size[groupA] += this.size[groupB];
  }

  getSize(el) {
    return this.size[this.find(el)];
  }

  get groups() {
    const map = new Map();
    this.elements.forEach(el => {
      const groupRepresentative = this.find(el);
      if (!map.has(groupRepresentative)) map.set(groupRepresentative, []);
      (map.get(groupRepresentative).push(el));
    });
    return Array.from(map.values());
  }
}

/** Not calculating the actual distance here, just a representation, since Math.sqrt is considerably slow and we don't care about actual distances
 *  https://stackoverflow.com/questions/2264760/efficient-way-of-finding-distance-between-two-3d-points
 */
const getDistanceScore = (pointA, pointB) => {
  const a = pointA.split(',').map(Number);
  const b = pointB.split(',').map(Number);
  return (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2 + (b[2] - a[2]) ** 2;
};

const getAllCombinations = (arr) => {
  const combinations = [];
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      combinations.push([arr[i], arr[j], getDistanceScore(arr[i], arr[j])]);
    }
  }
  return combinations;
};

const inputData = readFileSync('input.txt', 'utf-8').trim().split('\n');
const junctionBoxes = new UnionFind(inputData);
const connectionStack = getAllCombinations(inputData).sort(([, , a], [, , b]) => b - a);

const numberOfConnections = 1_000;
for (let i = 0; i < numberOfConnections; i++) {
  junctionBoxes.union(connectionStack.pop());
}

const checksum = junctionBoxes.groups.sort((a, b) => a.length - b.length).slice(-3).reduce((acc, cur) => acc * cur.length, 1);

console.log(`Part 1: ${checksum}`);

while (true) {
  let nextConnection = connectionStack.pop();
  junctionBoxes.union(nextConnection);
  if (junctionBoxes.groups.length === 1) {
    const [lightA, lightB] = nextConnection;
    console.log(`Part 2: ${Number(lightA.split(',').at(0)) * Number(lightB.split(',').at(0))}`);
    break;
  }
}
