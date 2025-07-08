import { IntCodeComputer } from './utils/useIntCodeInterpreter.mjs';
import fs from 'node:fs';

class Screen {
  walls = [];
  blocks = [];
  paddle;
  ball;
  score;

  #typeMap = {
    1: (pos) => this.walls.push(pos),
    2: (pos) => this.blocks.push(pos),
    3: (pos) => this.paddle = pos,
    4: (pos) => this.ball = pos,
  };

  addElement(x, y, type) {
    if (x === -1 && y === 0) this.score = type;
    else this.#typeMap[type]?.({ x, y });
  }
}

const memory = fs.readFileSync('input.txt', 'utf-8').trim().split(',').map(Number);

const vm1 = new IntCodeComputer(memory, { pauseOnOutput: true, outputPauseInterval: 3 });
const screen1 = new Screen();

vm1.on(vm1.EVENT_NAMES.AFTER_PAUSE, async () => {
  const [x, y, type] = vm1.outputQueue.slice(-3);
  screen1.addElement(x, y, type);
  await vm1.run();
});

vm1.on(vm1.EVENT_NAMES.AFTER_HALT, async () => {
  console.log(`Part 1: ${screen1.blocks.length}`);
  await vm2.run();
});

await vm1.run();

const vm2 = new IntCodeComputer(memory, { pauseOnOutput: true, outputPauseInterval: 3 });
vm2.changeMemory(0, 2);
const screen2 = new Screen();

vm2.on(vm2.EVENT_NAMES.AFTER_PAUSE, async () => {
  const [x, y, type] = vm2.outputQueue.slice(-3);
  screen2.addElement(x, y, type);
  await vm2.run();
});

vm2.on(vm2.EVENT_NAMES.NEEDS_INPUT, async () => {
  vm2.queueInput(Math.sign(screen2.ball.x - screen2.paddle.x));
});

vm2.on(vm2.EVENT_NAMES.AFTER_HALT, () => {
  console.log(`Part 2: ${screen2.score}`);
});
