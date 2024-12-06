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

  patrol() {
    const visited = new Set();
    const isInBounds = ({ x, y }) => y >= 0 && y < this.#map.length && x >= 0 && x < this.#map[0].length;
    let x = this.x;
    let y = this.y;
    let currentDir = 0;

    while (true) {
      const [offsetX, offsetY] = this.#directions[currentDir];
      const targetX = x + offsetX;
      const targetY = y + offsetY;

      if (!isInBounds({ x: targetX, y: targetY })) break;

      if (this.#map[targetY][targetX] === '#') {
        currentDir = (currentDir + 1) % 4;
        continue;
      }

      y = targetY;
      x = targetX;
      visited.add(`${y}|${x}`);
    }

    return { visited };
  }
}

const inputData = fs.readFileSync('testInput.txt', 'utf-8').trim().split('\n').map(row => row.split(''));
const guard = new Guard(inputData);

const { visited } = guard.patrol();
console.log(`Part 1: ${visited.size}`);

for (let i = 0; i < 17_000; i++) {
}
