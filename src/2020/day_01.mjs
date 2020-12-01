import * as fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => parseInt(data));

const COMBINATION_TYPE = { PAIR: 'pair', TRIPLE: 'triple' };

const findCombination = ({ type }) => {
  for (let i = 0; i < inputData.length; i++) {
    for (let j = i + 1; j < inputData.length; j++) {
      if (type === COMBINATION_TYPE.PAIR && inputData[i] + inputData[j] === 2020) return [inputData[i], inputData[j]];
      for (let k = j + 1; k < inputData.length; k++) {
        if (inputData[i] + inputData[j] + inputData[k] === 2020) return [inputData[i], inputData[j], inputData[k]];
      }
    }
  }
};

const multiply = (acc, cur) => acc * cur;

console.log(`Part 1: ${findCombination({ type: COMBINATION_TYPE.PAIR }).reduce(multiply, 1)}`);
console.log(`Part 2: ${findCombination({ type: COMBINATION_TYPE.TRIPLE }).reduce(multiply, 1)}`);

