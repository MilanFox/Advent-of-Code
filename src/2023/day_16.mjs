import * as fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').split('\n').filter(Boolean).map(line => line.split(''));

const directions = {
  'north': { offsetX: 0, offsetY: -1 },
  'east': { offsetX: 1, offsetY: 0 },
  'south': { offsetX: 0, offsetY: 1 },
  'west': { offsetX: -1, offsetY: 0 },
};

const allDirections = Object.keys(directions);

const rotateBeam = (direction, rotation) => {
  const currentIndex = allDirections.findIndex(dir => dir === direction);
  if (rotation === 'clockwise') return allDirections[(currentIndex + 4 - 1) % 4];
  if (rotation === 'counterclockwise') return allDirections[(currentIndex + 1) % 4];
};

const splitBeam = (direction) => {
  const currentIndex = allDirections.findIndex(dir => dir === direction);
  return [allDirections[(currentIndex + 1) % 4], allDirections[(currentIndex + 3) % 4]];
};

let beamCache = Array.from({ length: inputData.length }, () => Array.from({ length: inputData[0].length }, () => ({})));
const invalidateCache = () => beamCache = Array.from({ length: inputData.length }, () => Array.from({ length: inputData[0].length }, () => ({})));

const continueBeam = (dir, x, y) => {
  if (!inputData[y]) return;
  if (!inputData[y][x]) return;
  const currentCell = inputData[y][x];

  if (beamCache[y][x][dir]) return;
  beamCache[y][x][dir] = true;

  if (currentCell === '.') {
    continueBeam(dir, x + directions[dir].offsetX, y + directions[dir].offsetY);
    return;
  }

  if (currentCell === '/') {
    const rotation = dir === 'north' || dir === 'south' ? 'counterclockwise' : 'clockwise';
    const newDirection = rotateBeam(dir, rotation);
    continueBeam(newDirection, x + directions[newDirection].offsetX, y + directions[newDirection].offsetY);
    return;
  }

  if (currentCell === '\\') {
    const rotation = dir === 'north' || dir === 'south' ? 'clockwise' : 'counterclockwise';
    const newDirection = rotateBeam(dir, rotation);
    continueBeam(newDirection, x + directions[newDirection].offsetX, y + directions[newDirection].offsetY);
    return;
  }

  if (currentCell === '|') {
    if (dir === 'north' || dir === 'south') {
      continueBeam(dir, x + directions[dir].offsetX, y + directions[dir].offsetY);
      return;
    }
    for (const splitDir of splitBeam(dir)) {
      continueBeam(splitDir, x + directions[splitDir].offsetX, y + directions[splitDir].offsetY);
    }
    return;
  }

  if (currentCell === '-') {
    if (dir === 'west' || dir === 'east') {
      continueBeam(dir, x + directions[dir].offsetX, y + directions[dir].offsetY);
      return;
    }
    for (const splitDir of splitBeam(dir)) {
      continueBeam(splitDir, x + directions[splitDir].offsetX, y + directions[splitDir].offsetY);
    }
  }
};

continueBeam('east', 0, 0);
const energisedCells = () => beamCache.reduce((acc, row) => acc + row.reduce((acc, cell) => Object.keys(cell).length ? acc + 1 : acc, 0), 0);

console.log(`Part 1: ${energisedCells()}`);

let mostEnergizedCells = 0;

for (let i = 0; i < inputData.length; i++) {
  invalidateCache();
  continueBeam('south', i, 0);
  mostEnergizedCells = Math.max(mostEnergizedCells, energisedCells());

  invalidateCache();
  continueBeam('north', i, inputData.length - 1);
  mostEnergizedCells = Math.max(mostEnergizedCells, energisedCells());
}

for (let i = 0; i < inputData[0].length; i++) {
  invalidateCache();
  continueBeam('west', inputData.length - 1, inputData.length - 1 - i);
  mostEnergizedCells = Math.max(mostEnergizedCells, energisedCells());

  invalidateCache();
  continueBeam('east', inputData.length - 1, inputData.length - 1 - i);
  mostEnergizedCells = Math.max(mostEnergizedCells, energisedCells());
}

console.log(`Part 2: ${mostEnergizedCells}`);
