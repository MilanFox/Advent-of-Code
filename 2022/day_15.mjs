import fs from 'fs';

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map((info) => info.match(/[+-]?\d+/g).map(Number))
  .map(([sensorX, sensorY, beaconX, beaconY]) => ({ sensorX, sensorY, beaconX, beaconY }));

const getBeaconCoverage = ({ sensorX, sensorY, beaconX, beaconY }, line) => {
  const beaconOffsetY = Math.abs(beaconY - sensorY);
  const beaconOffsetX = Math.abs(beaconX - sensorX);
  const distanceFromCenter = Math.abs(line - sensorY);
  const radius = beaconOffsetX + beaconOffsetY;
  const widthAtLine = 2 * (radius - distanceFromCenter) + 1;
  return Array.from({ length: widthAtLine }, (_, i) => (sensorX - (radius - distanceFromCenter)) + i);
};

const getBeaconsInLine = (line) => inputData.filter(({ beaconY }) => beaconY === line);

const potentiallyBlocked = new Set(inputData.map((sensor) => getBeaconCoverage(sensor, 2_000_000)).flat());
const existingBeaconsInRange = getBeaconsInLine(2_000_000).map(({ beaconX }) => beaconX);
const blocked = [...potentiallyBlocked].filter((x) => !existingBeaconsInRange.includes(x));

console.log(`Part 1: ${blocked.length}`);

