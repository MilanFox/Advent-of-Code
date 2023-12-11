import * as fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').split('\n').filter(Boolean).map(line => line.split(''));
const galaxy = '#';

const emptyColumns = Array
  .from({ length: inputData[0].length }, (_, posX) => posX)
  .filter(posX => !inputData.some(row => row[posX] === galaxy));

const emptyRows = inputData
  .reduce((acc, cur, index) => !cur.some(cell => cell === galaxy) ? [...acc, index] : acc, []);

const allGalaxies = inputData.flatMap((line, y) => line.flatMap((cell, x) => (cell === galaxy) ? [{ y, x }] : []));

const generatePairings = (galaxies) => {
  const pairings = [];
  const numberOfGalaxies = galaxies.length;
  for (let i = 0; i < numberOfGalaxies; i++) {
    for (let j = i + 1; j < numberOfGalaxies; j++) {
      const minY = Math.min(galaxies[i].y, galaxies[j].y);
      const maxY = Math.max(galaxies[i].y, galaxies[j].y);
      const minX = Math.min(galaxies[i].x, galaxies[j].x);
      const maxX = Math.max(galaxies[i].x, galaxies[j].x);
      const emptySpaceCrossingsY = emptyRows.filter(row => row > minY && row < maxY).length;
      const emptySpaceCrossingsX = emptyColumns.filter(col => col > minX && col < maxX).length;

      pairings.push([galaxies[i], galaxies[j], emptySpaceCrossingsY + emptySpaceCrossingsX]);
    }
  }
  return pairings;
};

const allPairings = generatePairings(allGalaxies);

const sumOfDistances = (pairings, multiplier) => pairings
  .map(([{ x: x1, y: y1 }, { x: x2, y: y2, }, emptySpaceCrossings]) =>(Math.abs(x2 - x1) + Math.abs(y2 - y1) + (emptySpaceCrossings * (multiplier - 1))))
  .reduce((acc, cur) => (acc || 0) + cur);

console.log(`Part 1: ${sumOfDistances(allPairings, 2)}`);
console.log(`Part 2: ${sumOfDistances(allPairings, 1_000_000)}`);
