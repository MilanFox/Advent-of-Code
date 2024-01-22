import fs from 'fs';
const inputFile = fs.readFileSync('input.txt', 'utf-8');
const lineBreak = /\n/g;

// Part 1
const getFirstAndLast = (input) => {
  const allDigits = [...input].filter(c => !isNaN(parseInt(c, 10)));
  return parseInt(`${allDigits.at(0)}${allDigits.at(-1)}`);
};

const generateSum = (input) => (input
  .split(lineBreak)
  .filter(Boolean) // filter out empty lines
  .map(getFirstAndLast)
  .reduce((num, acc) => num + acc, 0))

// Part 2
const replaceStringValues = (inputString) => ( // "nine" => "n9e", two => "t2o", "four" => "f4r"
  ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
    .reduce((string, num, index) => string
      .replaceAll(num, `${num[0]}${index + 1}${num.slice(-1)}`), inputString));

console.log(`Part 1: ${generateSum(inputFile)}`);
console.log(`Part 2: ${generateSum(replaceStringValues(inputFile))}`);
