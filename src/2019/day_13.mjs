import { IntCodeComputer } from './utils/useIntCodeInterpreter.mjs';
import fs from 'node:fs';

class Screen {
  walls = [];
  blocks = [];
  paddle;
  ball;

  #typeMap = {
    1: (pos) => this.walls.push(pos),
    2: (pos) => this.blocks.push(pos),
    3: (pos) => this.paddle = pos,
    4: (pos) => this.ball = pos,
  };

  addElement(x, y, type) {
    this.#typeMap[type]?.({ x, y });
  }
}

const memory = fs.readFileSync('input.txt', 'utf-8').trim().split(',').map(Number);

const vm = new IntCodeComputer(memory, { pauseOnOutput: true, outputPauseInterval: 3 });
const screen = new Screen();

vm.on(vm.EVENT_NAMES.AFTER_PAUSE, async () => {
  const [x, y, type] = vm.outputQueue.slice(-3);
  screen.addElement(x, y, type);
  await vm.run();
});

vm.on(vm.EVENT_NAMES.AFTER_HALT, () => {
  console.log(`Part 1: ${screen.blocks.length}`);
  console.log(screen);
});

await vm.run();
