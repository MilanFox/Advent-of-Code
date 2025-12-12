import { readFileSync } from 'node:fs';

const inputData = readFileSync('testinput.txt', 'utf-8').trim().split('\n').map(line => {
  const indicatorLights = line.match(/(?<=\[).*?(?=])/)[0].split('').map(char => char === '#' ? 1 : 0).join('');
  const numLights = indicatorLights.length;
  const indicatorLightValue = parseInt(indicatorLights, 2);

  const buttons = [...line.matchAll(/(?<=\().*?(?=\))/g)].map(m => {
    const definition = m[0].split(',').map(Number);
    const mask = definition.reduce((acc, i) => acc | (1 << (numLights - 1 - i)), 0);
    return { definition, mask };
  });

  const joltageTarget = line.match(/(?<=\{).*?(?=})/)[0].split(',').map(Number);
  return { indicatorLightValue, joltageTarget, buttons };
});

const findFastestStartupSequence = ({ indicatorLightValue, buttons }) => {
  const queue = [[0, 0]];
  const seen = new Set([0]);

  while (queue.length) {
    const [cur, presses] = queue.shift();
    if (cur === indicatorLightValue) return presses;
    for (const button of buttons) {
      const next = cur ^ button.mask;
      if (!seen.has(next)) {
        seen.add(next);
        queue.push([next, presses + 1]);
      }
    }
  }
};

const startupTime = inputData.map(findFastestStartupSequence).reduce((acc, cur) => acc + cur, 0);
console.log(`Part 1: ${startupTime}`);

/**
 * @see: https://www.reddit.com/r/adventofcode/comments/1pk87hl/2025_day_10_part_2_bifurcate_your_way_to_victory/
 */

const getAllLegalCombinations = (machine) => {
  let combos = [[]];
  for (const button of machine.buttons) combos = [...combos, ...combos.map(s => [...s, button])];
  return combos.filter(combo => combo.reduce((acc, button) => acc ^ button.mask, 0) === machine.indicatorLightValue);
};

const findFastestConfiguration = (machine) => {
  const memo = new Map();

  const solveSubProblem = (machine) => {
    const parity = machine.joltageTarget.map(n => n % 2 === 0 ? 0 : 1);
    const indicatorLightValue = parseInt(parity.join(''), 2);

    const combinations = getAllLegalCombinations({ ...machine, indicatorLightValue });
    if (!combinations.length) return Infinity;

    const solutions = combinations.map(combination => {
      const joltageTarget = combination
        .reduce((acc, button) => {
          for (const i of button.definition) acc[i] -= 1;
          return acc;
        }, [...machine.joltageTarget])
        .map(n => n / 2);

      let debug = combination.map(({ definition }) => definition); //TODO

      if (joltageTarget.some(n => n < 0)) return Infinity;
      if (joltageTarget.every(n => n === 0)) return combination.length;

      return solveSubProblem({ ...machine, joltageTarget }) * 2 + combination.length;
    });

    return solutions.sort((a, b) => a - b).at(0);
  };

  return solveSubProblem(machine);
};

findFastestConfiguration(inputData[2]); //?
