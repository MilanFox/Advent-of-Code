import * as fs from 'node:fs';

class CodeBlock {
  constructor(data) {
    const [bitmask, ...instructions] = data;

    this.bitmask = bitmask.split('').reduce((acc, cur, i) => cur === 'X' ? acc : [...acc, [i, parseInt(cur)]], []);

    this.instructions = instructions.filter(Boolean).map(instruction => {
      const getMaskedValue = (int) => {
        let binValue = Number(int).toString(2).padStart(36, '0');
        this.bitmask.forEach(([i, val]) => binValue = binValue.substring(0, i) + val + binValue.substring(i + 1));
        return parseInt(binValue, 2);
      };
      const [address, value] = instruction.match(/\d+/g);
      return {
        address: parseInt(address), value: parseInt(value), maskedValue: getMaskedValue(value),
      };
    });
  }
}

class Program {
  constructor(code) {
    this.codeBlocks = code;
    this.#memory = [];
  }

  #memory;

  run() {
    for (let i = 0; i < this.codeBlocks.length; i++) {
      const { instructions } = this.codeBlocks[i];
      instructions.forEach(({ address, maskedValue }) => this.#memory[address] = maskedValue);
    }
  }

  get totalMemoryValue() {
    return this.#memory.filter(addr => addr).reduce((acc, cur) => acc + cur, 0);
  };
}

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('mask = ')
  .map(block => new CodeBlock(block.split('\n')));

const program = new Program(inputData);

program.run();
console.log(`Part 1: ${program.totalMemoryValue}`);
