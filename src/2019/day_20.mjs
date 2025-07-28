import { readFileSync } from 'node:fs';

const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

class Maze {
  constructor(data) {
    this.#map = data.split('\n').map(line => line.split(('')));
    this.findPortals();
  }

  findPortals() {
    this.portals = {};

    const visitedPositions = new Set();

    const findPortalTile = ([x, y]) => {
      let letterA = this.#map[y][x];

      const directions = [
        { dx: 0, dy: -1, tileY: y - 1, letterBY: y + 1 },
        { dx: 0, dy: 2, tileY: y + 2, letterBY: y + 1 },
        { dx: -1, dy: 0, tileX: x - 1, letterBX: x + 1 },
        { dx: 2, dy: 0, tileX: x + 2, letterBX: x + 1 },
      ];

      for (let dir of directions) {
        if (dir.dy && this.#map[dir.tileY]?.[x] === '.') {
          visitedPositions.add(`${x}|${dir.letterBY}`);
          return { portal: letterA + this.#map[dir.letterBY][x], tile: [x, dir.tileY] };
        }
        if (dir.dx && this.#map[y]?.[dir.tileX] === '.') {
          visitedPositions.add(`${dir.letterBX}|${y}`);
          return { portal: letterA + this.#map[y][dir.letterBX], tile: [dir.tileX, y] };
        }
      }
    };

    const mapWidth = this.#map.reduce((acc, cur) => Math.max(acc, cur.length), 0);

    for (let y = 0; y < this.#map.length; y++) {
      for (let x = 0; x < mapWidth; x++) {
        if ([undefined, ' ', '.', '#'].includes(this.#map[y][x]) || visitedPositions.has(`${x}|${y}`)) continue;
        const { portal, tile } = findPortalTile([x, y]);
        (this.portals[portal] ??= []).push(tile);
      }
    }
  }

  #map;
  portals;
}

const maze = new Maze(readFileSync('testInput.txt', 'utf-8'));

console.log(maze);
