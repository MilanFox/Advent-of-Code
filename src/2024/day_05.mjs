import fs from 'node:fs';

const [_rules, _updates] = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n\n').map(data => data.split('\n'));

const updates = _updates.map(set => set.split(',').map(Number));
const rules = _rules.map(rule => rule.split('|').map(Number));

const isInValidOrder = (update) => rules.every(([a, b]) => update.indexOf(a) < update.indexOf(b) || update.indexOf(b) === -1);
const getMiddleNumber = (update) => update[Math.floor(update.length / 2)];
const toSum = (acc, cur) => acc + cur;

const checksum = updates.filter(isInValidOrder).map(getMiddleNumber).reduce(toSum, 0);
console.log(`Part 1: ${checksum}`);
