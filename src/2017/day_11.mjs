import * as fs from 'node:fs';

/* https://www.redblobgames.com/grids/hexagons/ */

const axialCoordinates = {
  n: { q: 0, r: -1 },
  ne: { q: 1, r: -1 },
  se: { q: 1, r: 0 },
  s: { q: 0, r: 1 },
  sw: { q: -1, r: 1 },
  nw: { q: -1, r: 0 },
};

const trace = fs.readFileSync('input.txt', 'utf-8').trim().split(',').map(data => data);

const getAxialDistance = (a, b) => (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
let maxDistance = 0;

const root = { q: 0, r: 0 };
const child = { q: 0, r: 0 };

trace.forEach(dir => {
  child.q += axialCoordinates[dir].q;
  child.r += axialCoordinates[dir].r;
  maxDistance = Math.max(maxDistance, getAxialDistance(root, child));
});

console.log(`Part 1: ${getAxialDistance(root, child)}`);
console.log(`Part 2: ${maxDistance}`);
