import { readFileSync } from 'node:fs';

const diskParser = /Disc #(?<id>\d+) has (?<interval>\d+) positions; at time=0, it is at position (?<initialPosition>\d+)\./;

const disks = readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(line => Object.fromEntries(Object.entries(diskParser.exec(line).groups).map(([k, v]) => [k, Number(v)])));

const findFirstPossibleStart = () => {
  Object.values(disks).forEach((disk) => disk.offset = (((-disk.initialPosition - disk.id) % disk.interval) + disk.interval) % disk.interval);

  const getLCM = (...params) => {
    const getGreatestCommonDivisor = (x, y) => (!y ? x : getGreatestCommonDivisor(y, x % y));
    const getLeastCommonMultiple = (x, y) => (x * y) / getGreatestCommonDivisor(x, y);
    return [...params].reduce((a, b) => getLeastCommonMultiple(a, b));
  };

  /* https://en.wikipedia.org/wiki/Chinese_remainder_theorem */

  let time = disks[0].offset;
  let period = disks[0].interval;

  for (const disk of disks.slice(1)) {
    while (time % disk.interval !== disk.offset % disk.interval) time += period;
    period = getLCM(period, disk.interval);
  }

  return time;
};

console.log(`Part 1: ${findFirstPossibleStart()}`);

disks.push({ id: disks.length + 1, interval: 11, initialPosition: 0 });
console.log(`Part 2: ${findFirstPossibleStart()}`);
