import { readFileSync } from 'node:fs';

const program = readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(line => line.replace(',', '').split(' '))
  .map(([instr, ...params]) => [instr, params]);

class Computer {
  constructor(a = 0, b = 0) {
    this.memory = { a, b };

    this.pointer = 0;

    this.instructions = {
      hlf: (reg) => {
        this.memory[reg] = this.memory[reg] / 2;
        this.pointer += 1;
      },
      tpl: (reg) => {
        this.memory[reg] = this.memory[reg] * 3;
        this.pointer += 1;
      },
      inc: (reg) => {
        this.memory[reg] = this.memory[reg] + 1;
        this.pointer += 1;
      },
      jmp: (ofs) => {
        this.pointer += Number(ofs);
      },
      jie: (reg, ofs) => {
        if (this.memory[reg] % 2 === 0) {
          this.pointer += Number(ofs);
        } else {
          this.pointer += 1;
        }
      },
      jio: (reg, ofs) => {
        if (this.memory[reg] === 1) {
          this.pointer += Number(ofs);
        } else {
          this.pointer += 1;
        }
      },
    };
  }

  execute(program) {
    while (true) {
      if (program[this.pointer] === undefined) return;
      const [instr, params] = program[this.pointer];
      this.instructions[instr](...params);
    }
  }
}

const computer = new Computer();
computer.execute(program);
console.log(`Part 1: ${computer.memory.b}`);

const computer2 = new Computer(1);
computer2.execute(program);
console.log(`Part 2: ${computer2.memory.b}`);
