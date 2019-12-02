import * as fs from 'node:fs';
import { IntCodeComputer } from './utils/useIntCodeInterpreter.mjs';

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split(',').map(n => parseInt(n));

const restoreGravityAssist = async (noun, verb) => {
  const memory = [...inputData];
  memory[1] = noun;
  memory[2] = verb;
  const computer = new IntCodeComputer(memory);

  await computer.run();
  return computer.memory[0];
};

console.log(`Part 1: ${await restoreGravityAssist(12, 2)}`);

const findNounAndVerb = async () => {
  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      if (await restoreGravityAssist(noun, verb) === 19690720) return 100 * noun + verb;
    }
  }
};

console.log(`Part 2: ${await findNounAndVerb()}`);
