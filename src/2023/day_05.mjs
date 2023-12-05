import * as fs from 'node:fs';

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .split('\n\n')
  .map(chunk => {
    let [category, data] = chunk.split(':');
    data = data.trim().split('\n').map(line => line.trim().split(' ').map(n => parseInt(n, 10)));
    return { category, data };
  })
  .reduce((acc, cur) => {
    if (cur.category === 'seeds') return { ...acc, seeds: cur.data[0] };
    return { ...acc, maps: [...acc.maps, cur] };
  }, { maps: [] });

const findNextValue = (currentValue, mapIndex) => {
  let value = currentValue;
  inputData.maps[mapIndex].data.forEach(([destStart, sourceStart, range]) => {
    if (currentValue >= sourceStart && currentValue < sourceStart + range) value = (currentValue - sourceStart) + destStart;
  });
  return value;
};

const findLocation = (seed) => inputData.maps.reduce((value, _, i) => findNextValue(value, i), seed);
let allLocations = inputData.seeds.map(findLocation);

console.log(`Part 1: ${Math.min(...allLocations)}`);

inputData.seedPairs = inputData.seeds.reduce((acc, _, i) => (i % 2 === 0 ? [...acc, [inputData.seeds[i], inputData.seeds[i + 1]]] : acc), []);

const findPrevValue = (currentValue, mapIndex) => {
  let value = currentValue;
  inputData.maps.toReversed()[mapIndex].data.forEach(([destStart, sourceStart, range]) => {
    if (currentValue >= destStart && currentValue < destStart + range) value = sourceStart - (destStart - currentValue);
  });
  return value;
};

const isNumberInSeeds = (num) => inputData.seedPairs.some(([start, range]) => num >= start && num < start + range);

let location = 0;
let seed = undefined;

const findSeed = (location) => {
  let value = location;
  for (let i = 0; i < inputData.maps.length; i++) value = findPrevValue(value, i);
  return value;
};

while (true) {
  seed = findSeed(location);
  if (isNumberInSeeds(seed)) break;
  location++;
}

console.log(`Part 2: ${location}`);
