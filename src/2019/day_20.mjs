import { readFileSync } from 'node:fs';

class Maze {
  constructor(data) {
    this.#map = data.split('\n').map(line => line.split(('')));

    this.dimensions = {
      x: this.#map.reduce((acc, cur) => Math.max(acc, cur.length), 0),
      y: this.#map.length,
    };

    this.nodes = Array.from({ length: this.dimensions.y }, (_, y) =>
      Array.from({ length: this.dimensions.x }, (_, x) => ({ x, y })));

    this.findPortals();

    this.start = this.portals['AA'][0];
    this.end = this.portals['ZZ'][0];
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

    for (let y = 0; y < this.dimensions.y; y++) {
      for (let x = 0; x < this.dimensions.x; x++) {
        if ([undefined, ' ', '.', '#'].includes(this.#map[y][x]) || visitedPositions.has(`${x}|${y}`)) continue;
        const { portal, tile } = findPortalTile([x, y]);
        (this.portals[portal] ??= []).push(tile);
      }
    }
  }

  findShortestPath() {
    const queue = [[this.start, 0]];
    const visited = new Set();

    while (queue.length) {
      const [[x, y], steps] = queue.shift();
      visited.add(`${x}|${y}`);

      if (x === this.end[0] && y === this.end[1]) return steps;

      if (!this.nodes[y][x].neighbours) this.nodes[y][x].neighbours = this.findNeighbours([x, y]);
      this.nodes[y][x].neighbours.forEach(({ x: targetX, y: targetY }) => {
        if (!visited.has(`${targetX}|${targetY}`)) queue.push([[targetX, targetY], steps + 1]);
      });
    }
  }

  findNeighbours([x, y]) {
    const directNeighbours = [[-1, 0], [0, 1], [1, 0], [0, -1]]
      .filter(([dx, dy]) => this.#map[y + dy][x + dx] === '.')
      .map(([dx, dy]) => [x + dx, y + dy]);

    const portalNeighbor = (Object.values(this.portals).find(tiles => tiles.some(([px, py]) => x === px && y === py)) || []).filter(([px, py]) => x !== px && y !== py);

    return [directNeighbours, portalNeighbor].flat().map((([x, y]) => this.nodes[y][x]));
  }

  #map;
  portals;
  nodes;
}

const maze = new Maze(readFileSync('input.txt', 'utf-8'));

console.log(`Part 1: ${maze.findShortestPath()}`);
