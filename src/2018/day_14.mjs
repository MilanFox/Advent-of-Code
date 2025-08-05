import { readFileSync } from 'node:fs';

const inputData = readFileSync('input.txt', 'utf-8').trim();

const recipes = [3, 7];
let elves = [0, 1];

const appendNextRecipe = () => {
  const next = elves
    .reduce((acc, cur) => acc + recipes[cur], 0)
    .toString()
    .split('')
    .map(Number);

  recipes.push(...next);
  return next;
};

const moveElves = () => elves = elves.map(elf => (elf + recipes[elf] + 1) % recipes.length);

let runningCount = 0;
let foundIndex;

while (recipes.length < Number(inputData) + 10 || !foundIndex) {
  const appended = appendNextRecipe();

  appended.forEach((number, i, arr) => {
    const char = number.toString();
    const isMatch = char === inputData[runningCount];
    const isRestart = char === inputData[0];
    const isFullMatch = isMatch && runningCount + 1 === inputData.length;

    if (isFullMatch && !foundIndex) foundIndex = recipes.length - inputData.length - (arr.length - 1 - i);
    runningCount = isMatch ? runningCount + 1 : isRestart ? 1 : 0;
  });

  moveElves();
}

console.log(`Part 1: ${recipes.slice(Number(inputData), Number(inputData) + 10).join('')}`);
console.log(`Part 2: ${foundIndex}`);
