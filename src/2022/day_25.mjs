import * as fs from 'node:fs';

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n');

const convertToDecimal = (snafuNumber) => {
  const snafuValues = { '2': 2, '1': 1, '0': 0, '-': -1, '=': -2 };
  const toValue = (snafuDigit) => snafuValues[snafuDigit];
  const toSingleNumber = (acc, cur, i) => (acc || 0) + (cur * (5 ** i));
  return snafuNumber.split('').map(toValue).toReversed().reduce(toSingleNumber);
};

const convertToSnafu = (decimalNumber) => {
  const decimalValues = { '-2': '=', '-1': '-', '0': '0', '1': '1', '2': '2' };
  const result = [];
  let rest = decimalNumber;
  while (rest > 0) {
    const currentDigit = ((rest + 2) % 5) - 2;
    rest = Math.floor((rest + 2) / 5);
    result.push(decimalValues[currentDigit]);
  }
  return result.toReversed().join('');
};

const sumOfFuelRequirements = inputData.map(convertToDecimal).reduce((acc, cur) => acc + cur, 0);
const snafuValue = convertToSnafu(sumOfFuelRequirements);

console.log(`Part 1: "${snafuValue}"`);
