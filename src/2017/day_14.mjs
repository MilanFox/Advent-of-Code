import * as fs from 'node:fs';
import { Hash } from './utils/useKnotHash.mjs';

const inputString = fs.readFileSync('input.txt', 'utf-8').trim();

const grid = Array.from({ length: 128 }, (_, i) => {
  const hash = new Hash(`${inputString}-${i}`);
  hash.hash();
  return [...hash.knotHash].flatMap(digit => parseInt(digit, 16).toString(2).padStart(4, '0').split(''));
});

const getNumberOfFilledCells = (grid) => grid.flat().filter(cell => cell === '1').length;

console.log(`Part 1: ${getNumberOfFilledCells(grid)}`);

const getNumberOfIslands = (grid) => {
  const shadowGrid = Array.from({ length: 128 }, () => Array.from({ length: 128 }, () => '0'));
  let islands = 0;
  const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

  const isInBounds = (matrix, { X, Y }) => Y >= 0 && Y < matrix.length && X >= 0 && X < matrix[0].length;

  const floodFill = ({ x, y }) => {
    const queue = [{ x, y }];
    while (queue.length) {
      const { x, y } = queue.shift();
      shadowGrid[y][x] = '1';
      directions.forEach(([offsetX, offsetY]) => {
        const X = offsetX + x;
        const Y = offsetY + y;
        if (isInBounds(grid, { X, Y }) && grid[Y][X] === '1' && shadowGrid[Y][X] === '0') {
          queue.push({ x: X, y: Y });
        }
      });
    }
  };

  for (let row = 0; row < 128; row++) {
    for (let col = 0; col < 128; col++) {
      if (grid[row][col] === '1' && shadowGrid[row][col] === '0') {
        islands++;
        floodFill({ x: col, y: row });
      }
    }
  }

  return islands;
};

console.log(`Part 2: ${getNumberOfIslands(grid)}`);
