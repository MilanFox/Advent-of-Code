import * as fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(row => row.split(''));

const getNumberOfTrees = ({ stepX, stepY }) => {
  let x = 0;
  let trees = 0;
  for (let y = 0; y < inputData.length; y += stepY) {
    if (inputData[y][x] === '#') trees += 1;
    x = (x + stepX) % inputData[0].length;
  }
  return trees;
};

const slopes = [
  { stepX: 1, stepY: 1 },
  { stepX: 3, stepY: 1 },
  { stepX: 5, stepY: 1 },
  { stepX: 7, stepY: 1 },
  { stepX: 1, stepY: 2, },
];

console.log(`Part 1: ${getNumberOfTrees(slopes[1])}`);
console.log(`Part 2: ${slopes.map(data => getNumberOfTrees(data)).reduce((acc, cur) => acc * cur, 1)}`)
