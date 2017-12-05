import * as fs from 'node:fs';

class Program {
  constructor(instructions) {
    this.#instructions = instructions;
  }

  #instructions;

  run({ limitOffset } = { limitOffset: false }) {
    let pointer = 0;
    let steps = 0;
    const instructions = [...this.#instructions];
    while (instructions[pointer] !== undefined) {
      const currentInstruction = instructions[pointer];
      if (limitOffset && currentInstruction >= 3) instructions[pointer] -= 1;
      else instructions[pointer] += 1;
      steps += 1;
      pointer += currentInstruction;
    }
    return steps;
  }
}

const program = new Program(fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(n => parseInt(n)));

console.log(`Part 1: ${program.run()}`);
console.log(`Part 2: ${program.run({ limitOffset: true })}`);
