import * as fs from 'node:fs';
import crypto from 'crypto';

const inputData = fs.readFileSync('input.txt', 'utf-8').split('\n').filter(Boolean);

const rotateClockwise = {
  0: (platform) => platform,
  90: (platform) => Array.from({ length: platform[0].length }, (_, i) => platform.map((row) => row[i]).join('').split('').toReversed().join('')),
  180: (platform) => platform.map((row) => row.split('').toReversed().join('')).toReversed(),
  270: (platform) => Array.from({ length: platform[0].length }, (_, i) => platform.map((row) => row[i]).join('')).toReversed(),
};

const pushRoundRocksLeft = (line) => line.split('#').map(chunk => chunk.split('').toSorted().toReversed().join('')).join('#');
const directionMap = { north: 270, west: 0, south: 90, east: 180 };
const tilt = (platform, direction) => rotateClockwise[(360 - directionMap[direction]) % 360](rotateClockwise[directionMap[direction]](platform).map(pushRoundRocksLeft));
const getAllWeights = (row, index) => row.split('').filter(char => char === 'O').length * (row.length - index);
const sum = (acc, cur) => (acc || 0) + cur;

console.log(`Part 1: ${tilt(inputData, 'north').map(getAllWeights).reduce(sum)}`);

const patternCache = {};
const tiltCycle = (platform, cycles) => {
  let rotatedPlatform = [...platform];
  for (let cycle = 0; cycle < cycles; cycle++) {
    for (const direction of Object.keys(directionMap)) {
      rotatedPlatform = tilt(rotatedPlatform, direction);
    }
    const patternHash = crypto.createHash('sha256').update(rotatedPlatform.toString()).digest('hex');
    if (patternCache[patternHash]) {
      const loopStartingFrom = patternCache[patternHash].cycle;
      const mod = cycle - loopStartingFrom;
      return Object.values(patternCache)[loopStartingFrom + ((cycles - loopStartingFrom) % mod) - 1].platform;
    }
    patternCache[patternHash] = { cycle, platform: [...rotatedPlatform] };
  }
  return rotatedPlatform;
};

console.log(`Part 2: ${tiltCycle(inputData, 1_000_000_000).map(getAllWeights).reduce(sum)}`);
