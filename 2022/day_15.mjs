import fs from "fs";

const inputData = fs
  .readFileSync('testInput.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(info => info.match(/\d+/g).map(Number))
  .map(([sensorX, sensorY, beaconX, beaconY]) => ({sensorX, sensorY, beaconX, beaconY}));

const getBeaconCoverage = ({sensorX, sensorY, beaconX, beaconY}, line) => {
  const beaconOffsetY = beaconY - sensorY;
  const beaconOffsetX = beaconX - sensorX;
  const radius = Math.abs(beaconOffsetX) * 2 + 1 + 2 * beaconOffsetY;
  const widthAtLine = Math.max(radius - Math.abs(line - sensorY * 2), 0);

  return Array.from({length: widthAtLine}, (_, i) => (sensorX - (Math.floor(widthAtLine / 2)) + i));
};

const blocked = new Set(inputData.map(sensor => getBeaconCoverage(sensor, 10)).flat());

console.log(`Part 1: ${blocked.size}`);
