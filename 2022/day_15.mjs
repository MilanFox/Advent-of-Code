import fs from 'fs';

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map((info) => info.match(/[+-]?\d+/g).map(Number))
  .map(([ sensorX, sensorY, beaconX, beaconY ]) => ({ sensorX, sensorY, beaconX, beaconY }));

const getBeaconCoverage = ({ sensorX, sensorY, beaconX, beaconY }, line) => {
  const beaconOffsetY = Math.abs(beaconY - sensorY);
  const beaconOffsetX = Math.abs(beaconX - sensorX);
  const radius = beaconOffsetX * 2 + beaconOffsetY * 2 + 1;
  const widthAtLine = Math.max(radius - Math.abs(line - sensorY) * 2, 0);
  return Array.from({ length: widthAtLine }, (_, i) => sensorX - Math.floor(widthAtLine / 2) + i);
};

const getBeaconsInLine = (line) => inputData.filter(({ beaconY }) => beaconY === line);

const potentiallyBlocked = new Set(inputData.map((sensor) => getBeaconCoverage(sensor, 10)).flat());
const existingBeaconsInRange = getBeaconsInLine(2000000).map(({ beaconX }) => beaconX);
const blocked = [ ...potentiallyBlocked ].filter((x) => !existingBeaconsInRange.includes(x));

console.log(`Part 1: ${blocked.length}`);
