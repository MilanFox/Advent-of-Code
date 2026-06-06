import { readFileSync } from 'node:fs';

const fileDefinitionMatcher = /^\/dev\/grid\/node-x(?<x>\d+)-y(?<y>\d+)\s+(?<size>\d+)T\s+(?<used>\d+)T\s+(?<available>\d+)T\s+(?<percentage>\d+)%$/;

class StorageNode {
  constructor(data) {
    this.x = Number(data.x);
    this.y = Number(data.y);
    this.size = Number(data.size);
    this.used = Number(data.used);
    this.avail = Number(data.available);
    this.percentage = Number(data.percentage);
  }
}

const inputData = readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .slice(2)
  .map(line => new StorageNode(line.match(fileDefinitionMatcher)?.groups));

const gridSize = inputData.reduce((acc, cur) => {
  acc.x = Math.max(cur.x, acc.x);
  acc.y = Math.max(cur.y, acc.y);
  return acc;
}, { x: 0, y: 0 });

const grid = Array.from({ length: gridSize.y + 1 }, () => Array.from({ length: gridSize.x + 1 }));

inputData.forEach(el => grid[el.y][el.x] = el);

const viablePairs = inputData
  .flatMap(A => inputData.filter(node => node !== A).map(B => [A, B]))
  .filter(([A, B]) => A.used > 0 && A.used <= B.avail);

console.log(`Part 1: ${viablePairs.length}`);
