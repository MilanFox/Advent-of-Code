import { readFileSync } from 'node:fs';

const inputData = readFileSync('input.txt', 'utf-8');

const initialStateMatcher = /(?<=initial state:\s).*$/m;
const conversionMatcher = /^([.#]{5}) => ([.#])$/gm;

const stringToBin = (str) => BigInt(`0b${str.split('').map(cha => cha === '#' ? 1 : 0).join('')}`);

const initialState = stringToBin(inputData.match(initialStateMatcher)[0]);

const conversions = [...inputData.matchAll(conversionMatcher).map(match => match[0])]
  .map(line => line.split(' => ').map(stringToBin))
  .reduce((acc, [matcher, result]) => {
    acc[Number(matcher)] = result.toString();
    return acc;
  }, {});

const extract = (num, pos) => {
  const offset = pos - 2;
  const o = BigInt(Math.abs(offset));
  return offset >= 0 ? Number((num >> o) & 0x1Fn) : Number((num << o) & 0x1Fn);
};

const getNextGeneration = (currentGeneration) => {
  let plants = [];
  const maxIndex = currentGeneration.toString(2).length - 1;

  extract(currentGeneration, 26);

  for (let i = -2; i <= maxIndex + 2; i++) {
    const windowMask = extract(currentGeneration, i);
    plants[maxIndex + 2 - i] = conversions[windowMask] ?? '0';
  }

  const nextGeneration = plants.slice(0, plants.lastIndexOf('1') + 1).join('');

  const offset = plants.findIndex(el => el === '1') - 2;//?

  return { number: BigInt(`0b${nextGeneration}`), offset };
};

const getStateAfterNGenerations = (numberOfGenerations) => {
  let state = initialState;
  let firstIndex = 0;

  for (let i = 0; i < numberOfGenerations; i++) {
    const { number, offset } = getNextGeneration(state);
    state = number;
    firstIndex += offset;
  }

  const checksum = state
    .toString(2)
    .split('')
    .map((n, i) => n * (i + firstIndex))
    .reduce((acc, cur) => acc + cur, 0);

  return { state, firstIndex, checksum };
};

console.log(`Part 1: ${getStateAfterNGenerations(20).checksum}`);
