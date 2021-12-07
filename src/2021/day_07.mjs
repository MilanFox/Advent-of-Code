import * as fs from 'node:fs';

const crabs = fs.readFileSync('input.txt', 'utf-8').trim().split(',').map(n => parseInt(n));

const findBestPosition = ({ doFuelCostsIncrease }) => {
  const medianPosition = crabs.toSorted((a, b) => a - b)[Math.floor(crabs.length / 2)];
  const queue = [medianPosition];
  const visited = [];
  let leastFuelConsumption = Number.MAX_SAFE_INTEGER;

  const sumUpTo = (n) => {
    let sum = 0;
    for (let i = 1; i <= n; i++) sum += i;
    return sum;
  };

  while (queue.length) {
    const index = queue.shift();
    if (visited.includes(index)) continue;
    if (index < 0 || index >= crabs.length) continue;

    visited.push(index);

    let _fuel = 0;
    for (let i = 0; i < crabs.length; i++) {
      const distance = Math.abs(crabs[i] - index);
      _fuel += doFuelCostsIncrease ? sumUpTo(distance) : distance;
      if (_fuel >= leastFuelConsumption) break;
    }

    leastFuelConsumption = Math.min(leastFuelConsumption, _fuel);

    queue.push(index - 1);
    queue.push(index + 1);
  }

  return leastFuelConsumption;
};

console.log(`Part 1: ${findBestPosition({ doFuelCostsIncrease: false })}`);
console.log(`Part 1: ${findBestPosition({ doFuelCostsIncrease: true })}`);

