import * as fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(n => parseInt(n));

const preambleSize = 25;

const findPossibleNumbers = (_, index) => {
  const possibleNumbers = [];
  for (let i = index - 1; i >= 0 && i > index - preambleSize; i--) {
    possibleNumbers.push(inputData[i] + inputData[index]);
  }
  return possibleNumbers;
};

const lookup = Array.from({ length: preambleSize }, findPossibleNumbers);

const findFirstWeakness = () => {
  for (let i = preambleSize; i < inputData.length; i++) {
    const isValidNumber = lookup.slice(i - preambleSize, i).some(list => list.includes(inputData[i]));
    if (!isValidNumber) return inputData[i];
    lookup.push(findPossibleNumbers(undefined, i));
  }
};

const firstWeakness = findFirstWeakness();
console.log(`Part 1: ${firstWeakness}`);

const findEncryptionWeakness = (weakNumber) => {
  const getEncryptionKey = (arr) => {
    arr.sort();
    return arr.at(0) + arr.at(-1);
  };

  leftPointer: for (let i = 0; i < inputData.length; i++) {
    for (let j = i + 1; j < inputData.length; j++) {
      const window = inputData.slice(i, j + 1);
      const sum = window.reduce((acc, cur) => acc + cur, 0);
      if (sum > weakNumber) continue leftPointer;
      if (sum === weakNumber) return getEncryptionKey(window);
    }
  }
};

const encryptionWeakness = findEncryptionWeakness(firstWeakness);
console.log(`Part 2: ${encryptionWeakness}`);
