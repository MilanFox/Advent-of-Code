import fs from 'node:fs';

const [patternData, designData] = fs.readFileSync('input.txt', 'utf-8').trim().split('\n\n').map(data => data);
const patterns = patternData.split(', ');
const designs = designData.split('\n');

const findAllArrangements = (design, i, memo = {}) => {
  if (design in memo) return memo[design];
  if (design === '') return 1;
  
  let arrangements = 0;
  const validPatterns = patterns.filter(pattern => design.startsWith(pattern));

  validPatterns.forEach(pattern => arrangements += findAllArrangements(design.substring(pattern.length), i, memo));

  memo[design] = arrangements;
  return arrangements;
};

const possibleArrangements = designs.map(findAllArrangements);

console.log(`Part 1: ${possibleArrangements.filter(Boolean).length}`);
console.log(`Part 2: ${possibleArrangements.reduce((acc, cur) => acc + cur, 0)}`);
