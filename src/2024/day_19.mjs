import fs from 'node:fs';

const [patternData, designData] = fs.readFileSync('testInput.txt', 'utf-8').trim().split('\n\n').map(data => data);

const patterns = patternData.split(', ');
const designs = designData.split('\n');

const isPossible = (design) => {
  const stack = [design];
  while (stack.length) {
    if (stack.includes('')) return true;
    const currentDesign = stack.pop();
    const validPatterns = patterns.filter(pattern => currentDesign.startsWith(pattern));
    validPatterns.forEach(pattern => stack.push(currentDesign.substring(pattern.length)));
  }
  return false;
};

console.log(`Part 1: ${designs.filter(isPossible).length}`);
