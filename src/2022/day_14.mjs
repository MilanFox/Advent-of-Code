import * as fs from 'node:fs';

const content = { EMPTY: ' ', WALL: '█', SAND: '•' };

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(line => line.split(' -> ').map(path => path.split(',').map(Number)));

const floorLevel = inputData.flat().map(([_, y]) => y).reduce((acc, cur) => Math.max(acc, cur), 0) + 3;

const generateCave = (drawFloor) => {
  const cave = Array.from({ length: floorLevel }, () => Array.from({ length: 500 + floorLevel }, () => content.EMPTY));

  inputData.forEach(line => {
    line.forEach(([sourceX, sourceY], i) => {
      if (i === line.length - 1) return;
      const [targetX, targetY] = line[i + 1];
      const [fromX, toX] = [sourceX, targetX].toSorted((a, b) => a - b);
      const [fromY, toY] = [sourceY, targetY].toSorted((a, b) => a - b);

      for (let y = fromY; y <= toY; y++) {
        for (let x = fromX; x <= toX; x++) {
          cave[y][x] = content.WALL;
        }
      }
    });
  });

  if (drawFloor) cave[floorLevel - 1].fill(content.WALL);

  return cave;
};

const spawnNewSand = (cave) => {
  let x = 500;
  let y = 0;

  if (cave[y][x] !== content.EMPTY) return false;

  while (true) {
    if (y >= floorLevel - 1) return false;

    if (cave[y + 1][x] === content.EMPTY) {
      y += 1;
      continue;
    }

    if (cave[y + 1][x - 1] === content.EMPTY) {
      y += 1;
      x -= 1;
      continue;
    }

    if (cave[y + 1][x + 1] === content.EMPTY) {
      y += 1;
      x += 1;
      continue;
    }

    break;
  }

  cave[y][x] = content.SAND;
  return { x, y };
};

const simulateSand = (cave) => {
  while (true) {
    const wasSuccessful = spawnNewSand(cave);
    if (!wasSuccessful) break;
  }

  return cave.reduce((acc, curLine) => acc + curLine.filter(cell => cell === content.SAND).length, 0);
};

const cave1 = generateCave();
console.log(`Part 1: ${simulateSand(cave1)}`);

const cave2 = generateCave(true);
console.log(`Part 1: ${simulateSand(cave2)}`);

// Why not...
const printCave = (cave, name) => fs.writeFileSync(name, cave.map(line => line.join('').substring(500 - floorLevel + 1, 500 + floorLevel)).join('\n'), { flag: 'w+' });
printCave(cave1, 'visualization.txt');
printCave(cave2, 'visualization2.txt');
