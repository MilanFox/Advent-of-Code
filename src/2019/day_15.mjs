import { readFileSync } from 'node:fs';
import { IntCodeComputer } from './utils/useIntCodeInterpreter.mjs';
import fs from 'fs';

const dirs = [
  { offset: [0, -1], command: 1 },
  { offset: [1, 0], command: 4 },
  { offset: [0, 1], command: 2 },
  { offset: [-1, 0], command: 3 },
];

const commandMap = dirs.reduce((acc, { command, offset }) => {
  acc[command] = offset;
  return acc;
}, {});

class Tile {
  constructor(x, y, { isExplored, isWall, isOxygen, isStart } = {}) {
    this.x = x;
    this.y = y;

    this.isStart = isStart ?? false;
    this.isExplored = isExplored ?? false;
    this.isWall = isWall ?? false;
    this.isOxygen = isOxygen ?? false;
  }
}

class Map {
  constructor({ vm }) {
    this.nodes = {};
    this.nodes['0|0'] = new Tile(0, 0, { isExplored: true, isStart: true });
    this.robot = { x: 0, y: 0 };
    this.dimensions = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    this.unexplored = dirs.map(({ offset }) => offset);
    this.unexplored.forEach(([x, y]) => this.nodes[`${x}|${y}`] = new Tile(x, y));
    this.vm = vm;
  }

  #updateDimensions([x, y]) {
    this.dimensions.minX = Math.min(this.dimensions.minX, x);
    this.dimensions.maxX = Math.max(this.dimensions.maxX, x);
    this.dimensions.minY = Math.min(this.dimensions.minY, y);
    this.dimensions.maxY = Math.max(this.dimensions.maxY, y);
  }

  #findSequence([targetX, targetY]) {
    const visited = new Set([`${this.robot.x}|${this.robot.y}`]);
    const queue = [];

    dirs.forEach(({ offset: [dx, dy], command }) => {
      const neighbour = this.nodes[`${this.robot.x + dx}|${this.robot.y + dy}`];
      if (neighbour) queue.push([neighbour, [command]]);
    });

    while (queue.length) {
      const [node, sequence] = queue.shift();

      const hash = `${node.x}|${node.y}`;
      if (visited.has(hash)) continue;
      visited.add(hash);

      if (node.x === targetX && node.y === targetY) return sequence;

      if (!node.isExplored || node.isWall) continue;

      dirs.forEach(({ offset: [dx, dy], command }) => {
        const neighbour = this.nodes[`${node.x + dx}|${node.y + dy}`];
        if (neighbour) queue.push([neighbour, [...sequence, command]]);
      });
    }

    return null;
  }

  async #exploreNext() {
    const target = this.unexplored.shift();
    const [targetX, targetY] = target;
    const targetNode = this.nodes[`${targetX}|${targetY}`];

    if (!targetNode || targetNode.isExplored) return;

    this.#updateDimensions(target);
    const sequence = this.#findSequence(target);

    if (!sequence) return;

    for (const command of sequence) {
      this.vm.queueInput(command);
      await this.vm.run();
      const result = this.vm.lastOutput;
      const [dx, dy] = commandMap[command];

      if (result !== 0) {
        this.robot.x += dx;
        this.robot.y += dy;

        const node = this.nodes[`${this.robot.x}|${this.robot.y}`];
        node.isExplored = true;
        node.isOxygen = result === 2;

        dirs.forEach(({ offset: [dx, dy] }) => {
          const x = this.robot.x + dx;
          const y = this.robot.y + dy;
          const hash = `${x}|${y}`;

          if (!this.nodes[hash]) {
            this.nodes[hash] = new Tile(x, y);
            this.unexplored.push([x, y]);
          }
        });
      } else {
        const wallX = this.robot.x + dx;
        const wallY = this.robot.y + dy;
        const node = this.nodes[`${wallX}|${wallY}`];

        node.isWall = true;
        node.isExplored = true;
        break;
      }
    }
  }

  #draw() {
    fs.writeFileSync('visualization.txt', this.grid.map(line => line
      .map(node => {
        if (!node) return ' ';
        if (node.isWall) return '█';
        if (node.isOxygen) return 'O';
        if (node.isStart) return 'S';
        return ' ';
      })
      .join('')).join('\n'), { flag: 'w+' });
  }

  async chart() {
    while (this.unexplored.length) {
      await this.#exploreNext();
    }

    const gridSizeY = -this.dimensions.minY + this.dimensions.maxY + 1;
    const gridSizeX = -this.dimensions.minX + this.dimensions.maxX + 1;
    this.grid = Array.from({ length: gridSizeY }, () => Array.from({ length: gridSizeX }));

    Object.values(this.nodes).forEach(node => {
      const x = node.x - this.dimensions.minX;
      const y = node.y - this.dimensions.minY;
      this.grid[y][x] = node;
    });

    this.#draw();
  }

  get fastestOxygenRoute() {
    const nodes = Object.values(this.nodes);
    const start = nodes.find(node => node.isStart);

    const visited = new Set();
    const queue = [[start, 0]];

    while (queue.length) {
      const [node, steps] = queue.shift();

      const hash = `${node.x}|${node.y}`;
      if (visited.has(hash)) continue;
      visited.add(hash);

      if (node.isWall) continue;
      if (node.isOxygen) return steps;

      dirs.forEach(({ offset: [dx, dy] }) => {
        const nextNode = this.nodes[`${node.x + dx}|${node.y + dy}`];
        if (nextNode) queue.push([nextNode, steps + 1]);
      });
    }

    return null;
  }
}

const program = readFileSync('input.txt', 'utf-8').trim().split(',').map(Number);
const computer = new IntCodeComputer(program, { pauseOnOutput: true });

const map = new Map({ vm: computer });
await map.chart();

console.log(`Part 1: ${map.fastestOxygenRoute}`);
