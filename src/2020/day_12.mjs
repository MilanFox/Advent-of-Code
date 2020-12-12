import * as fs from 'node:fs';

class Instruction {
  constructor(data) {
    this.instruction = data[0];
    this.value = parseInt(data.slice(1));
  }

  #compass = ['N', 'E', 'S', 'W'];
  #turns = ['L', 'R'];

  #directions = {
    'N': { axis: 'y', delta: -1 },
    'E': { axis: 'x', delta: 1 },
    'S': { axis: 'y', delta: 1 },
    'W': { axis: 'x', delta: -1 },
    'L': { delta: -1 },
    'R': { delta: 1 },
  };

  execute(ferry) {
    const moveTowards = (dir) => {
      const { axis, delta } = this.#directions[dir];
      ferry[axis] += delta * this.value;
    };

    if (this.#compass.includes(this.instruction)) {
      moveTowards(this.instruction);
      return;
    }

    if (this.instruction === 'F') {
      moveTowards(ferry.facing);
      return;
    }

    if (this.#turns.includes(this.instruction)) {
      const { delta } = this.#directions[this.instruction];
      const steps = this.value / 90;
      const currentIndex = this.#compass.findIndex(dir => dir === ferry.facing);
      const newIndex = (((currentIndex + (delta * steps)) % 4) + 4) % 4;
      ferry.facing = this.#compass[newIndex];
    }
  }
}

class Ferry {
  constructor({ facing, instructions }) {
    this.x = 0;
    this.y = 0;
    this.facing = facing;
    this.instructions = instructions;
  }

  run() {
    this.instructions.forEach(instruction => instruction.execute(this));
  }

  get manhattenDistance() {
    return Math.abs(this.x + this.y);
  }
}

const instructions = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new Instruction(data));
const ferry = new Ferry({ instructions, facing: 'E' });

ferry.run();
console.log(`Part 1: ${ferry.manhattenDistance}`);
