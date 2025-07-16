import { readFileSync } from 'node:fs';

class AssembunnyComputer {
  constructor(instructions) {
    this.memory = { a: 0, b: 0, c: 0, d: 0 };
    this.instructions = instructions.map(instr => instr.split(' '));
  }

  run() {
    let pointer = 0;

    while (true) {
      if (!this.instructions[pointer]) break;
      const [instr, x, y] = this.instructions[pointer];

      switch (instr) {
        case 'cpy':
          this.memory[y] = this.memory[x] ?? Number(x);
          pointer += 1;
          break;
        case 'inc':
          this.memory[x] += 1;
          pointer += 1;
          break;
        case 'dec':
          this.memory[x] -= 1;
          pointer += 1;
          break;
        case 'jnz':
          if ((this.memory[x] ?? Number(x)) !== 0) pointer += Number(y);
          else pointer += 1;
          break;
      }
    }
  }

  setMemory(memory) {
    this.memory = memory;
  }
}

const instr = readFileSync('input.txt', 'utf-8').trim().split('\n');
const computer = new AssembunnyComputer(instr);

computer.run();
console.log(`Part 1: ${computer.memory.a}`);

computer.setMemory({ a: 0, b: 0, c: 1, d: 0 });
computer.run();
console.log(`Part 2: ${computer.memory.a}`);
