import * as assert from 'node:assert';
import { IntCodeComputer } from './useIntCodeInterpreter.mjs';

const add = async () => {
  const memory = [1001, 4, 1, 3, 99];
  const computer = new IntCodeComputer(memory);
  await computer.run();
  assert.equal(computer.memory[3], 100);
};

const multiply = async () => {
  const memory = [1002, 5, 25, 3, 99, 4];
  const computer = new IntCodeComputer(memory);
  await computer.run();
  assert.equal(computer.memory[3], 100);
};

const inOut = async () => {
  const memory = [3, 0, 4, 0, 99];
  const computer = new IntCodeComputer(memory, { input: [100] });
  await computer.run();
  assert.equal(computer.lastOutput, 100);
};

const equals = async () => {
  const memory = [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8];
  const computer = new IntCodeComputer(memory, { input: [8] });
  await computer.run();
  assert.equal(computer.lastOutput, 1);
};

const lessThan = async () => {
  const memory = [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8];
  const computer = new IntCodeComputer(memory, { input: [7] });
  await computer.run();
  assert.equal(computer.lastOutput, 1);
};

const jump = async () => {
  const memory = [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9];
  const computer = new IntCodeComputer(memory, { input: [5] });
  await computer.run();
  assert.equal(computer.lastOutput, 1);

  const computer2 = new IntCodeComputer(memory, { input: [0] });
  await computer2.run();
  assert.equal(computer2.lastOutput, 0);
};

const inputQueue = async () => {
  const memory = [3, 0, 4, 0, 99];
  const computer = new IntCodeComputer(memory);

  let emitted = false;
  computer.on(computer.EVENT_NAMES.NEEDS_INPUT, async () => {
    emitted = true;
    computer.queueInput(123);
    await computer.run();
  });

  await computer.run();
  assert.equal(emitted, true);
  assert.equal(computer.lastOutput, 123);
};

const relativeMode = async () => {
  const memory = [104, 1125899906842624, 99];
  const computer = new IntCodeComputer(memory);
  await computer.run();
  assert.equal(computer.lastOutput, 1125899906842624);
};

const tests = { add, multiply, inOut, equals, lessThan, jump, inputQueue, relativeMode };

Object.entries(tests).forEach(([name, test]) => {
  console.log(`Running test: '${name}'... done`);
  test();
});
