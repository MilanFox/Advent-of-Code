import * as fs from 'node:fs';

const inputFile = fs.readFileSync('input.txt', 'utf-8');

const getFirstAndLast = (input) => {
  const allDigits = [...input].filter(c => !isNaN(parseInt(c, 10)));
  return parseInt(`${allDigits.at(0)}${allDigits.at(-1)}`);
};

const generateSum = (input) => (input
  .trim()
  .split('\n')
  .map(getFirstAndLast)
  .reduce((num, acc) => num + acc, 0));

const replaceStringValues = (inputString) => (['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
  .reduce((string, num, index) => string
    .replaceAll(num, `${num[0]}${index + 1}${num.slice(-1)}`), inputString));

console.log(`Part 1: ${generateSum(inputFile)}`);
console.log(`Part 2: ${generateSum(replaceStringValues(inputFile))}`);
