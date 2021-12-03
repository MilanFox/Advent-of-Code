import * as fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => data);

const getMostCommonBit = (arr, i) => arr.map(byte => byte[i]).filter(bit => bit === '0').length > (arr.length / 2) ? '0' : '1';

const gammaRateBin = Array.from({ length: inputData[0].length }, (_, i) => getMostCommonBit(inputData, i)).join('');
const epsilonRateBin = gammaRateBin.split('').map(bit => bit === '0' ? '1' : '0').join('');
const powerConsumption = parseInt(gammaRateBin, 2) * parseInt(epsilonRateBin, 2);

console.log(`Part 1: ${powerConsumption}`);

const bitCriteria = { MOST_COMMON: 'most common', LEAST_COMMON: 'least common' };

const getRating = (criteria) => inputData.reduce((acc, cur, i) => {
  if (acc.length === 1) return acc;
  const mostCommonBit = getMostCommonBit(acc, i);
  if (criteria === bitCriteria.MOST_COMMON) return acc.filter(byte => byte[i] === mostCommonBit);
  if (criteria === bitCriteria.LEAST_COMMON) return acc.filter(byte => byte[i] !== mostCommonBit);
}, inputData);

const [oxygenGeneratorRating] = getRating(bitCriteria.MOST_COMMON);
const [co2ScrubberRating] = getRating(bitCriteria.LEAST_COMMON);
const lifeSupportRating = parseInt(oxygenGeneratorRating, 2) * parseInt(co2ScrubberRating, 2);

console.log(`Part 2: ${lifeSupportRating}`);
