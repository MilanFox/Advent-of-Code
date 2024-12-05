import fs from 'node:fs';

const [_rules, _updates] = fs
  .readFileSync('testInput.txt', 'utf-8')
  .trim()
  .split('\n\n').map(data => data.split('\n'));

const updates = _updates.map(set => set.split(',').map(Number));
const rules = _rules.map(rule => rule.split('|').map(Number));

const isInValidOrder = (update) => rules.every(([a, b]) => update.indexOf(a) < update.indexOf(b) || update.indexOf(b) === -1);
const getMiddleNumber = (update) => update[Math.floor(update.length / 2)];
const toSum = (acc, cur) => acc + cur;

const correctlySortedUpdatesChecksum = updates
  .filter(isInValidOrder)
  .map(getMiddleNumber)
  .reduce(toSum, 0);

console.log(`Part 1: ${correctlySortedUpdatesChecksum}`);

// https://www.programiz.com/dsa/bubble-sort
const bubbleSort = (update) => {
  let swapped;
  while (swapped !== false) {
    swapped = false;
    for (let i = 0; i < update.length - 1; i++) {
      if (rules.some(([before, after]) => before === update[i] && after === update[i + 1])) {
        [update[i], update[i + 1]] = [update[i + 1], update[i]];
        swapped = true;
      }
    }
  }
  return update.toReversed();
};

const wronglySortedUpdatesChecksum = updates
  .filter(update => !isInValidOrder(update))
  .map(bubbleSort)
  .map(getMiddleNumber)
  .reduce(toSum, 0);

console.log(`Part 2: ${wronglySortedUpdatesChecksum}`);
