import * as fs from 'node:fs';
import { IntCodeComputer } from './utils/useIntCodeInterpreter.mjs';

const memory = fs.readFileSync('input.txt', 'utf-8').trim().split(',').map(n => parseInt(n));

const generatePermutations = (arr) => {
  const results = [];

  const permute = (subArr, m = []) => {
    if (subArr.length === 0) {
      results.push(m);
    } else {
      for (let i = 0; i < subArr.length; i++) {
        let curr = subArr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  };

  permute(arr);
  return results;
};

const findPowerLevel = async (inputSequence) => {
  let last = 0;

  for (let i = 0; i < 5; i++) {
    const computer = new IntCodeComputer(memory, { input: [inputSequence.shift(), last] });
    await computer.run();
    last = computer.lastOutput;
  }

  return last;
};

const findHighestPowerLevel = async () => {
  const permutations = generatePermutations([0, 1, 2, 3, 4]);
  let tempHighestPowerLevel = 0;

  for (const phaseSetting of permutations) {
    const powerlevel = await findPowerLevel(phaseSetting);
    tempHighestPowerLevel = Math.max(tempHighestPowerLevel, powerlevel);
  }

  return tempHighestPowerLevel;
};

const highestPowerLevel = await findHighestPowerLevel();

console.log(`Part 1: ${highestPowerLevel}`);

const findPowerLevelFeedbackLoop = async (phaseSetting) => {
  const amplifiers = phaseSetting.map(phase => new IntCodeComputer(memory, { pauseOnOutput: true, input: [phase] }));

  amplifiers[0].queueInput(0);

  let lastOutput = 0;
  let current = 0;

  while (!amplifiers[4].isHalted) {
    const amp = amplifiers[current];
    await amp.run();
    const output = amp.lastOutput;
    lastOutput = output;
    const nextAmp = amplifiers[(current + 1) % 5];
    nextAmp.queueInput(output);
    current = (current + 1) % 5;
  }

  return lastOutput;
};

const findHighestPowerLevelFeedbackLoop = async () => {
  const permutations = generatePermutations([5, 6, 7, 8, 9]);
  let tempHighestPowerLevel = 0;

  for (const phaseSetting of permutations) {
    const powerlevel = await findPowerLevelFeedbackLoop(phaseSetting);
    tempHighestPowerLevel = Math.max(tempHighestPowerLevel, powerlevel);
  }

  return tempHighestPowerLevel;
};

const part2 = await findHighestPowerLevelFeedbackLoop();
console.log(`Part 2: ${part2}`);
