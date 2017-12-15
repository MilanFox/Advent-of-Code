import * as fs from 'node:fs';

function createGenerator(seed, factor, multiple = 1) {
  const divisor = 2147483647;
  let value = seed;
  return () => {
    do {
      value = (value * factor) % divisor;
    } while (value % multiple !== 0);
    return value;
  };
}

const factors = [16807, 48271];

const seeds = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map((data) => parseInt(data.split(' ').at(-1)));

let generatorA = createGenerator(seeds[0], factors[0]);
let generatorB = createGenerator(seeds[1], factors[1]);

function getNumberOfMatchingTails(cycles) {
  let count = 0;
  for (let i = 0; i < cycles; i++) {
    const a = generatorA() & 0xFFFF;
    const b = generatorB() & 0xFFFF;
    if (a === b) count++;
  }
  return count;
}

console.log(`Part 1: ${getNumberOfMatchingTails(40_000_000)}`);

generatorA = createGenerator(seeds[0], factors[0], 4);
generatorB = createGenerator(seeds[1], factors[1], 8);

console.log(`Part 2: ${getNumberOfMatchingTails(5_000_000)}`);
