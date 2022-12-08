import * as fs from 'node:fs';

let trees = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(col => col.split('').map(tree => parseInt(tree)));

let visibleTrees = Array.from({ length: trees.length }, () => Array.from({ length: trees[0].length }, () => 0));

const rotate90 = (grid) => Array.from({ length: trees[0].length }, (_, i) => grid.map((row) => row[i]).toReversed());

for (let i = 0; i < 4; i++) {
  for (let y = 0; y < trees.length; y++) {
    for (let x = 0; x < trees[0].length; x++) {
      if (trees[y].slice(0, x).every(height => height < trees[y][x])) visibleTrees[y][x] = 1;
    }
  }
  trees = rotate90(trees);
  visibleTrees = rotate90(visibleTrees);
}

console.log(`Part 1: ${visibleTrees.reduce((acc, curRow) => acc + curRow.reduce((acc, curTree) => acc + curTree, 0), 0)}`);

let scenicScore = Array.from({ length: trees.length }, () => Array.from({ length: trees[0].length }, () => 1));

for (let i = 0; i < 4; i++) {
  for (let y = 0; y < trees.length; y++) {
    for (let x = 0; x < trees[0].length; x++) {
      const lookingDirection = trees[y].slice(0, x).toReversed();
      const viewingDistance = lookingDirection.every(tree => tree < trees[y][x]) ? lookingDirection.length : trees[y].slice(0, x).toReversed().findIndex(tree => tree >= trees[y][x]) + 1;
      scenicScore[y][x] *= viewingDistance;
    }
  }
  trees = rotate90(trees);
  scenicScore = rotate90(scenicScore);
}

console.log(`Part 2: ${scenicScore.reduce((acc, curRow) => Math.max(acc, curRow.reduce((acc, curTree) => Math.max(acc, curTree), 0)), 0)}`);
