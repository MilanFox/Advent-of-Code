import * as fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').split('\n').filter(Boolean).map(line => line.split(' '));
inputData.forEach(line => line[1] = line[1].split(',').map(n => parseInt(n, 10)));

const areAllGroupsValid = (sequence, condition) => sequence.split(/\./g).filter(Boolean).every((group, index) => group.length === condition[index]);

const isNumberOfGroupsCorrect = (sequence, condition) => sequence.split(/\./g).filter(Boolean).length === condition.length;

const findAllSolutions = ([record, condition]) => {
  const matches = [];
  const continueSequence = (sequence = '', nextChar = '', currentGroup = -1, currentPos = -1) => {
    if (nextChar) sequence += nextChar;
    for (let i = sequence.length; i < record.length; i++) {
      if (sequence.at(-1) === '.') currentPos = -1;
      if (sequence.at(-1) === '#') {
        currentPos += 1;
        if (sequence.at(-2) !== '#') currentGroup += 1;
      }
      if (currentPos > condition[currentGroup]) return;

      const nextChar = record[i];
      if (nextChar === '?') {
        if (areAllGroupsValid(sequence, condition)) continueSequence(sequence, '.', currentGroup);
        continueSequence(sequence, '#', currentGroup, currentPos);
        return;
      }
      sequence += nextChar;
    }
    if (areAllGroupsValid(sequence, condition) && isNumberOfGroupsCorrect(sequence, condition)) matches.push(sequence);
  };
  continueSequence();
  return matches.length;
};

const possibleSolutions = inputData.map(findAllSolutions);
console.log(`Part 1: ${possibleSolutions.reduce((acc, cur) => acc + cur, 0)}`);
