import fs from "fs";

const content = {
  EMPTY: ' ',
  WALL: '█',
  SAND: '•'
}

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(line => line.split(' -> ').map(path => path.split(',').map(Number)));

const cave = Array.from({length: 200}, () => Array.from({length: 600}, () => content.EMPTY));

inputData.forEach(line => {
  line.forEach(([sourceX, sourceY], i) => {
    if (i === line.length - 1) return;
    const [targetX, targetY] = line[i+1];
    const [fromX, toX] = [sourceX, targetX].toSorted((a, b) => a-b);
    const [fromY, toY] = [sourceY, targetY].toSorted((a, b) => a-b);

    for (let y = fromY; y <= toY; y++) {
      for (let x = fromX; x <= toX; x++) {
        cave[y][x] = content.WALL
      }
    }
  })
})

const spawnNewSand = () => {
  let x = 500;
  let y = 0;

  while (true) {
    if (y >= 199) return false;

    if (cave[y+1][x] === content.EMPTY) {
      y += 1;
      continue;
    }

    if (cave[y+1][x-1] === content.EMPTY) {
      y += 1;
      x -= 1;
      continue;
    }

    if (cave[y+1][x+1] === content.EMPTY) {
      y += 1;
      x += 1;
      continue;
    }

    break;
  }

  cave[y][x] = content.SAND;
  return {x, y};
}

const simulateSand = () => {
  while (true) {
    const wasSuccessful = spawnNewSand();
    if (!wasSuccessful) break;
  }

  return cave.reduce((acc, curLine) => acc + curLine.filter(cell => cell === content.SAND).length, 0);
}

console.log(`Part 1: ${simulateSand()}`);

fs.writeFileSync('visualization.txt', cave.map(line => line.join('')).join('\n'), {flag: 'w+'});
