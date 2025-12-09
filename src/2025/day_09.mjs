import { readFileSync } from 'node:fs';

const tiles = readFileSync('input.txt', 'utf-8').trim().split('\n').map(line => line.split(',').map(Number));

const getAllPermutations = (arr) => {
  const permutations = [];
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      permutations.push([arr[i], arr[j]]);
    }
  }
  return permutations;
};

const getArea = ([[x1, y1], [x2, y2]]) => (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);

const rectangles = getAllPermutations(tiles).map(getArea).sort((a, b) => b - a);

console.log(`Part 1: ${rectangles.at(0)}`);
