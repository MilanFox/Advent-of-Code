import { readFileSync } from 'node:fs';

const inputData = readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(floor => {
    const parser = /(?<element>\w+)(?:-compatible)? (?<type>generator|microchip)/g;
    return [...floor.matchAll(parser)].map(m => ({ ...m.groups }));
  });

let elements = [...new Set(inputData.flat().map(({ element }) => element).toSorted())];

let originalItemMap = elements.map(el => [
  inputData.findIndex(floor => floor.some(({ element, type }) => element === el && type === 'microchip')),
  inputData.findIndex(floor => floor.some(({ element, type }) => element === el && type === 'generator')),
]);

const getFastestRoute = (initState) => {
  const getHash = (itemMap, elevatorLevel) => `[${elevatorLevel}]>` + itemMap.map((pair, i) => `[${elements[i]}: ${pair.join('|')}]`).join('-');

  const isLegal = (itemMap) =>
    itemMap.every(([chipFloor, genFloor]) => chipFloor === genFloor || !itemMap.some(([_, otherGenFloor]) => otherGenFloor === chipFloor));

  const isComplete = (itemMap) =>
    itemMap.every(([chip, gen]) => chip === 3 && gen === 3);

  const getPermutations = (set) => {
    const result = [];
    for (let i = 0; i < set.length; i++) {
      for (let j = i + 1; j < set.length; j++) {
        result.push([set[i], set[j]]);
      }
    }
    return [...set.map(el => [el]), ...result];
  };

  const visited = new Set();

  const queue = [[initState, 0, 0]];

  while (queue.length) {
    const [state, elevatorLevel, steps] = queue.shift();

    if (isComplete(state)) return steps;

    const hash = getHash(state, elevatorLevel);
    if (visited.has(hash)) continue;
    visited.add(hash);

    if (!isLegal(state)) continue;

    const itemsOnTheCurrentFloor = state.reduce((acc, [chipFloor, genFloor], i) => {
      if (chipFloor === elevatorLevel) acc.push([i, 0]);
      if (genFloor === elevatorLevel) acc.push([i, 1]);
      return acc;
    }, []);

    const movableCombinations = getPermutations(itemsOnTheCurrentFloor);

    movableCombinations.forEach(combinations => {
      if (elevatorLevel < 3) {
        const nextState = structuredClone((state));
        for (const [element, type] of combinations) nextState[element][type] += 1;
        queue.push([nextState, elevatorLevel + 1, steps + 1]);
      }

      if (elevatorLevel > 0) {
        const nextState = structuredClone((state));
        for (const [element, type] of combinations) nextState[element][type] -= 1;
        queue.push([nextState, elevatorLevel - 1, steps + 1]);
      }
    });
  }
};

const fastestRoute = getFastestRoute(originalItemMap);

console.log(`Part 1: ${fastestRoute}`); // Todo: Runs for like a minute. Find out how to make a priority queue..
