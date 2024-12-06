import fs from 'node:fs';

class Guard {
  constructor(map) {
    const token = '^';
    this.#map = map;
    this.y = map.findIndex(row => row.includes(token));
    this.x = map[this.y].findIndex(cell => cell === token);
  }

  #map;
  #directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

  patrol({ obstruction } = {}) {
    const visited = new Set();
    const isInBounds = ({ x, y }) => y >= 0 && y < this.#map.length && x >= 0 && x < this.#map[0].length;
    let x = this.x;
    let y = this.y;
    let currentDir = 0;
    let isCyclic = false;
    const shouldDetectCycles = Boolean(obstruction);

    while (true) {
      const [offsetX, offsetY] = this.#directions[currentDir];
      const targetX = x + offsetX;
      const targetY = y + offsetY;

      if (!isInBounds({ x: targetX, y: targetY })) break;

      if (this.#map[targetY][targetX] === '#' || (targetY === obstruction?.y && targetX === obstruction?.x)) {
        currentDir = (currentDir + 1) % 4;
        continue;
      }

      y = targetY;
      x = targetX;
      let hash = `${y}|${x}`;
      if (shouldDetectCycles) hash += `|${currentDir}`;

      if (shouldDetectCycles && visited.has(hash)) {
        isCyclic = true;
        break;
      }

      visited.add(hash);
    }

    return { visited, isCyclic };
  }
}

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(row => row.split(''));
const guard = new Guard(inputData);

const { visited } = guard.patrol();
console.log(`Part 1: ${visited.size}`);

let cycles = 0;
for (let y = 0; y < inputData.length; y++) {
  for (let x = 0; x < inputData[0].length; x++) {
    const { isCyclic } = guard.patrol({ obstruction: { x, y } });
    cycles += isCyclic;
  }
}

console.log(`Part 2: ${cycles}`);
