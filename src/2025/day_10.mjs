import { readFileSync } from 'node:fs';

const inputData = readFileSync('input.txt', 'utf-8').trim().split('\n').map(line => {
  const indicatorLights = line.match(/(?<=\[).*?(?=])/)[0].split('').map(char => char === '#' ? 1 : 0).join('');
  const numLights = indicatorLights.length;
  const indicatorLightValue = parseInt(indicatorLights, 2);

  const buttons = [...line.matchAll(/(?<=\().*?(?=\))/g)].map(m => m[0].split(',').map(Number));
  const buttonValueMasks = buttons.map(button => button.reduce((acc, i) => acc | (1 << (numLights - 1 - i)), 0));

  const joltageTarget = line.match(/(?<=\{).*?(?=})/)[0].split(',').map(Number);

  return { indicatorLightValue, buttonValueMasks, joltageTarget, buttons };
});

console.log(inputData.map(({ joltageTarget }) => joltageTarget.length));

const findFastestStartupSequence = ({ indicatorLightValue, buttonValueMasks }) => {
  const queue = [[0, 0]];
  const seen = new Set([0]);

  while (queue.length) {
    const [cur, presses] = queue.shift();

    if (cur === indicatorLightValue) return presses;

    for (const mask of buttonValueMasks) {
      const next = cur ^ mask;

      if (!seen.has(next)) {
        seen.add(next);
        queue.push([next, presses + 1]);
      }
    }
  }
};

const startupTime = inputData.map(findFastestStartupSequence).reduce((acc, cur) => acc + cur, 0);
console.log(`Part 1: ${startupTime}`);
