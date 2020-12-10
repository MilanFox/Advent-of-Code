import * as fs from 'node:fs';

const adapters = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(n => parseInt(n));

const toStepCounts = (acc, cur, i, arr) => ({
  step1: acc.step1 + (arr[i - 1] === arr[i] - 1), step3: acc.step3 + (arr[i - 1] === arr[i] - 3),
});

const adapterChain = adapters.toSorted((a, b) => a - b);
adapterChain.unshift(0);
adapterChain.push(adapterChain.at(-1) + 3);

const joltageDifference = adapterChain.reduce(toStepCounts, { step1: 0, step3: 0 });

console.log(`Part 1: ${joltageDifference.step1 * joltageDifference.step3}`);

const findAllPossiblePaths = () => {
  const memo = {};
  const reverseChain = adapterChain.toReversed();

  const findNumberOfPaths = (i) => {
    if (memo[reverseChain[i]]) return memo[reverseChain[i]];
    let numberOfPaths = 0;

    if (i === reverseChain.length - 1) {
      numberOfPaths = 1;
    } else {
      for (let j = -3; j < 0; j++) {
        if (reverseChain[i - j] >= reverseChain[i] - 3) numberOfPaths += findNumberOfPaths(i - j);
      }
    }

    memo[reverseChain[i]] = numberOfPaths;
    return numberOfPaths;
  };

  findNumberOfPaths(0);
  return memo[reverseChain[0]];
};

console.log(`Part 2: ${findAllPossiblePaths()}`);
