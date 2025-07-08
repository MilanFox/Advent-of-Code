import { IntCodeComputer } from './utils/useIntCodeInterpreter.mjs';
import fs from 'node:fs';

class Robot {
  x = 0;
  y = 0;
  dir = 0;

  directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  circleMod = (value, mod) => ((value % mod) + mod) % mod;

  move(rotation) {
    if (rotation === 0) this.dir = this.circleMod(this.dir - 1, 4);
    else this.dir = this.circleMod(this.dir + 1, 4);
    const [dx, dy] = this.directions[this.dir];
    this.x += dx;
    this.y += dy;
  }
}

class Map {
  constructor(robot, { startingTileColor } = { startingTileColor: 0 }) {
    this.tiles[0][0] = startingTileColor;
    this.robot = robot;
  }

  tiles = [new Array(50).fill(0)];
  repaintedTiles = new Set();

  get currentColor() {
    if (!this.tiles[this.robot.y]) this.tiles[this.robot.y] = new Array(50).fill(0);
    return this.tiles[this.robot.y][this.robot.x] ?? 0;
  }

  paintCurrentTile(newColor) {
    if (this.currentColor !== newColor) this.repaintedTiles.add(`${this.robot.y}|${this.robot.x}`);
    this.tiles[this.robot.y][this.robot.x] = newColor;
  }

  get render() {
    return this.tiles.map(line => line.map(value => value ? '█' : ' ').join('')).join('\n');

  }
}

const memory = fs.readFileSync('input.txt', 'utf-8').trim().split(',').map(Number);

const executeRobotTurn = async (vm, map) => {
  vm.queueInput(map.currentColor);
  await vm.run();
  map.paintCurrentTile(vm.lastOutput);
  await vm.run();
  map.robot.move(vm.lastOutput);
  await vm.run();
};

const vm1 = new IntCodeComputer(memory, { pauseOnOutput: true });
const map1 = new Map(new Robot());

const vm2 = new IntCodeComputer(memory, { pauseOnOutput: true });
const map2 = new Map(new Robot(), { startingTileColor: 1 });

vm1.on(vm1.EVENT_NAMES.NEEDS_INPUT, async () => await executeRobotTurn(vm1, map1));
vm1.on(vm1.EVENT_NAMES.AFTER_HALT, async () => {
  console.log(`Part 1: ${map1.repaintedTiles.size}`);
  await vm2.run();
});

await vm1.run();

vm2.on(vm2.EVENT_NAMES.NEEDS_INPUT, async () => await executeRobotTurn(vm2, map2));
vm2.on(vm2.EVENT_NAMES.AFTER_HALT, () => console.log(`Part 2:\n${map2.render}`));
