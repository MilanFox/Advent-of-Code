import * as fs from 'node:fs';

let inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(line => line.split(' ').map(n => parseInt(n)));

const toSum = (acc, cur) => (acc || 0) + cur;

const breakDownSequence = (seq) => {
  const steps = [seq];
  while (!steps[steps.length - 1].every(n => n === 0)) {
    steps.push(steps[steps.length - 1].map((n, i, arr) => arr[i + 1] - n).slice(0, -1));
  }
  return steps;
};

const continueSequence = (seq, direction) => {
  const structure = breakDownSequence(seq).toReversed();
  const position = { next: -1, prev: 0 };
  const _continue = {
    next: (element, i) => {structure[i + 1] = [...structure, element.at(-1) + structure[i + 1].at(-1)];},
    prev: (element, i) => {structure[i + 1] = [structure[i + 1].at(0) - element.at(0), ...structure[i + 1]];},
  };
  for (let i = 0; i < structure.length - 1; i++) _continue[direction](structure[i], i);
  return structure.at(-1).at(position[direction]);
};

console.log(`Part 1: ${inputData.map(seq => continueSequence(seq, 'next')).reduce(toSum)}`);
console.log(`Part 2: ${inputData.map(seq => continueSequence(seq, 'prev')).reduce(toSum)}`);
