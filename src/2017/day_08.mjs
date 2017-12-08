import * as fs from 'node:fs';

class Program {
  constructor(instructions) {
    this.instructions = instructions;
  }

  get targetedRegisters() {
    return [...new Set(this.instructions.map(instructions => instructions.target).toSorted())];
  }

  run({ memory }) {
    this.instructions.forEach(({ target, amount, condition }) => {
      switch (condition.comparator) {
        case '>':
          if (memory.registers[condition.target].value > (condition.amount)) memory.registers[target].value += amount;
          break;
        case '<':
          if (memory.registers[condition.target].value < (condition.amount)) memory.registers[target].value += amount;
          break;
        case '==':
          if (memory.registers[condition.target].value === (condition.amount)) memory.registers[target].value += amount;
          break;
        case '<=':
          if (memory.registers[condition.target].value <= (condition.amount)) memory.registers[target].value += amount;
          break;
        case '>=':
          if (memory.registers[condition.target].value >= (condition.amount)) memory.registers[target].value += amount;
          break;
        case '!=':
          if (memory.registers[condition.target].value !== (condition.amount)) memory.registers[target].value += amount;
          break;
      }
    });
  }
}

class Memory {
  constructor(targetedRegisters) {
    this.registers = {};
    targetedRegisters.forEach(address => this.registers[address] = new MemoryAddress());
  }

  get largestValue() {
    return Object.values(this.registers).map(address => address.value).toSorted((a, b) => a - b).at(-1);
  }

  get peakValue() {
    return Object.values(this.registers).map(address => address.peak).toSorted((a, b) => a - b).at(-1);
  }
}

class MemoryAddress {
  constructor() {
    this.peak = 0;
  }

  #value = 0;

  get value() {
    return this.#value;
  }

  set value(n) {
    this.#value = n;
    this.peak = Math.max(this.value, this.peak);
  }
}

class Instruction {
  constructor(data) {
    const [target, instr, amount, _, conditionTarget, conditionComparator, comparatorAmount] = data.split(' ');
    this.target = target;
    this.amount = instr === 'inc' ? parseInt(amount) : -parseInt(amount);
    this.condition = { target: conditionTarget, comparator: conditionComparator, amount: parseInt(comparatorAmount) };
  }
}

const program = new Program(fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new Instruction(data)));
const memory = new Memory(program.targetedRegisters);

program.run({ memory });

console.log(`Part 1: ${memory.largestValue}`);
console.log(`Part 2: ${memory.peakValue}`);
