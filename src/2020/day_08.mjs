import * as fs from 'node:fs';

class Instruction {
  constructor(data) {
    [this.instruction, this.value] = data.split(' ').map(value => parseInt(value) || value);
    if (this.value === '+0') this.value = 0;
  }

  execute(software) {
    switch (this.instruction) {
      case 'jmp':
        software.pointer += this.value;
        break;
      case 'acc':
        software.acc += this.value;
        software.pointer += 1;
        break;
      default:
        software.pointer += 1;
    }
  }

  swapInstruction() {
    if (this.instruction === 'jmp') this.instruction = 'nop'; else this.instruction = 'jmp';
  }
}

class Program {
  constructor(data) {
    this.instructions = data.map(data => new Instruction(data));
  }

  run() {
    let data = { pointer: 0, acc: 0 };
    const visited = [];
    while (true) {
      const instruction = this.instructions[data.pointer];

      if (visited.includes(instruction)) return { status: 'loop', ...data };
      if (data.pointer === this.instructions.length) return { status: 'success', ...data };
      if (data.pointer > this.instructions.length) return { status: 'out of bounds', ...data };

      visited.push(instruction);
      instruction.execute(data);
    }
  }

  runAutoFix() {
    for (let i = 0; i < this.instructions.length; i++) {
      const inst = this.instructions[i];
      if (inst.instruction === 'acc') continue;
      inst.swapInstruction();
      const runInfo = this.run();
      if (runInfo.status === 'success') return runInfo;
      inst.swapInstruction();
    }
  }
}

const program = new Program(fs.readFileSync('input.txt', 'utf-8').trim().split('\n'));

console.log(`Part 1: ${program.run().acc}`);
console.log(`Part 2: ${program.runAutoFix().acc}`);
