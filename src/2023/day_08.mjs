import * as fs from 'node:fs';

let [instructions, mapping] = fs.readFileSync('input.txt', 'utf-8').split('\n\n').filter(Boolean);
mapping = mapping.split('\n').filter(Boolean).reduce((acc, curLine) => {
  const [dest, L, R] = curLine.match(/[A-Z0-9]{3}/g);
  return dest ? { ...acc, [dest]: { L, R } } : acc;
}, {});

const calculateSteps = (start, target) => {
  const loop = { counter: 0, next: start };
  for (let i = 0; !loop.next.endsWith(target); i = (i + 1) % instructions.length) {
    loop.counter++;
    loop.next = mapping[loop.next][instructions[i]];
  }
  return loop.counter;
};

console.log(`Part 1: ${calculateSteps('AAA', 'ZZZ')}`);

const allNeededSteps = Object.keys(mapping).filter(key => key.endsWith('A')).map(start => calculateSteps(start, 'Z'));

const getLCM = (...arr) => {
  const getGreatestCommonDivisor = (x, y) => (!y ? x : getGreatestCommonDivisor(y, x % y));
  const getLeastCommonMultiple = (x, y) => (x * y) / getGreatestCommonDivisor(x, y);
  return [...arr].reduce((a, b) => getLeastCommonMultiple(a, b));
};

console.log(`Part 2: ${getLCM(...allNeededSteps)}`);
