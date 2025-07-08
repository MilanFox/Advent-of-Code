import { IntCodeComputer } from './utils/useIntCodeInterpreter.mjs';
import fs from 'node:fs';

class Screen {
  walls = [];
  blocks = [];
  paddle = [];
  ball = [];

  #typeMap = {
    1: this.walls,
    2: this.blocks,
    3: this.paddle,
    4: this.ball,
  };

  addElement(x, y, type) {
    this.#typeMap[type]?.push({ x, y });
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
});

await vm.run();
