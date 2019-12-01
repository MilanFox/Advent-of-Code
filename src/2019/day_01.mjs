import * as fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => data);

const getBaseFuelCost = n => Math.floor(parseInt(n) / 3) - 2;

const getTotalFuelCost = n => {
  let remaining = n;
  let fuelCost = 0;
  while (remaining > 0) {
    const _cost = Math.max(getBaseFuelCost(remaining), 0);
    fuelCost += _cost;
    remaining = _cost;
  }
  return fuelCost;
};

const sum = (acc, cur) => (acc || 0) + cur;

console.log(`Part 1: ${inputData.map(getBaseFuelCost).reduce(sum)}`);
console.log(`Part 2: ${inputData.map(getTotalFuelCost).reduce(sum)}`);
