import { readFileSync } from 'node:fs';

const allLocations = readFileSync('input.txt', 'utf-8').trim().split('\n').map(line => line.split(', ').map(Number));

const mapDimensions = allLocations.reduce(([accX, accY], [curX, curY]) => [Math.max(accX, curX), Math.max(accY, curY)]);

const getManhattanDistance = (pointA, pointB) => Math.abs(pointA[0] - pointB[0]) + Math.abs(pointA[1] - pointB[1]);

const area = Array
  .from({ length: mapDimensions[1] + 1 }, () => Array(mapDimensions[0] + 1).fill(''))
  .map((row, y) => row.map((cell, x) => {
    const distances = allLocations
      .map(location => ({ location, dist: getManhattanDistance(location, [x, y]) }))
      .sort((a, b) => a.dist - b.dist);

    const hasMultipleClosestLocations = distances[0].dist === distances[1].dist;
    const closestLocation = hasMultipleClosestLocations ? null : distances[0];

    const sumOfDistances = distances.reduce((acc, cur) => acc + cur.dist, 0);

    return { closestLocation, sumOfDistances };
  }));

const scanPerimeter = () => {
  const topRow = area.at(0);
  const bottomRow = area.at(-1);
  const leftCol = area.map(([cell]) => cell);
  const rightCol = area.map(row => row.at(-1));

  const infiniteLocations = new Set([topRow, bottomRow, leftCol, rightCol]
    .flat()
    .map(({ closestLocation }) => closestLocation?.location)
    .filter(Boolean));

  return {
    infiniteLocations: [...infiniteLocations],
    finiteLocations: allLocations.filter(location => !infiniteLocations.has(location)),
  };
};

const { finiteLocations } = scanPerimeter();

const locationSizes = finiteLocations
  .map(location => ({
    location,
    size: area.map(row => row.filter(cell => cell.closestLocation?.location === location).length).reduce((acc, cur) => acc + cur, 0),
  }))
  .sort((a, b) => b.size - a.size);

console.log(`Part 1: ${locationSizes.at(0).size}`);

const numberOfSafeCells = (maxDistance) => {
  return area.reduce((acc, cur) => acc + cur.filter(cell => cell.sumOfDistances < maxDistance).length, 0);
};

console.log(`Part 2: ${numberOfSafeCells(10000)}`);
