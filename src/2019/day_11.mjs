import { IntCodeComputer } from './utils/useIntCodeInterpreter.mjs';
import fs from 'node:fs';

const memory = fs.readFileSync('input.txt', 'utf-8').trim().split(',').map(Number);

const vm = new IntCodeComputer(memory, { pauseOnOutput: true });

const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const circleMod = (value, mod) => ((value % mod) + mod) % mod;
const robot = { x: 0, y: 0, dir: 0 };

const map = [[]];

const repaintedTiles = new Set();

vm.on(vm.EVENT_NAMES.NEEDS_INPUT, async () => {
  if (!map[robot.y]) map[robot.y] = [];
  const currentColor = map[robot.y][robot.x] ?? 0;
  vm.queueInput(currentColor);
  await vm.run();

  const newColor = vm.lastOutput;
  if (currentColor !== newColor) repaintedTiles.add(`${robot.y}|${robot.x}`);
  map[robot.y][robot.x] = newColor;
  await vm.run();

  const rotation = vm.lastOutput;
  if (rotation === 0) robot.dir = circleMod(robot.dir - 1, 4);
  else robot.dir = circleMod(robot.dir + 1, 4);
  const [dx, dy] = directions[robot.dir];
  robot.x += dx;
  robot.y += dy;
  await vm.run();
});

vm.on(vm.EVENT_NAMES.AFTER_HALT, () => {
  console.log(`Part 1: ${repaintedTiles.size}`);
});

await vm.run();
