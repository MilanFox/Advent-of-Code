import * as fs from 'node:fs';

class Instruction {
  constructor(inputData) {
    const [amount, from, to] = inputData.match(/\d+/g);
    this.amount = parseInt(amount);
    this.from = parseInt(from);
    this.to = parseInt(to);
  }
}

class Warehouse {
  constructor(inputData) {
    const lines = inputData.split('\n');
    const numberOfStacks = parseInt(lines.pop().split('').at(-1), 10);
    this.stacks = Array.from({ length: numberOfStacks }, () => ([]));
    lines.toReversed().forEach(line => {
      const crates = Array.from({ length: numberOfStacks + 1 }, (_, i) => line.padEnd(numberOfStacks * 4, ' ').substring(i * 4 + 1, i * 4 + 2));
      crates.forEach((crate, i) => {
        if (crate.trim()) this.stacks[i].push(crate);
      });
    });
  };

  moveIndividually(instruction) {
    for (let i = 0; i < instruction.amount; i++) {
      this.stacks[instruction.to - 1].push(this.stacks[instruction.from - 1].pop());
    }
  };

  moveTogether(instruction) {
    const fromPos = this.stacks[instruction.from - 1].length - instruction.amount;

    for (let i = 0; i < instruction.amount; i++) {
      this.stacks[instruction.to - 1].push(this.stacks[instruction.from - 1][fromPos]);
      this.stacks[instruction.from - 1].splice(fromPos, 1);
    }
  };

  get topView() {
    return this.stacks.reduce((acc, cur) => acc + cur.at(-1), '');
  }
}

const [crates, instructions] = fs
  .readFileSync('input.txt', 'utf-8')
  .trimEnd()
  .split('\n\n')
  .map((dataSet, i) => i === 0 ? dataSet : dataSet.split('\n').map(set => new Instruction(set)));

const warehouse1 = new Warehouse(crates);
instructions.forEach(instruction => warehouse1.moveIndividually(instruction));
console.log(`Part 1: ${warehouse1.topView}`);

const warehouse2 = new Warehouse(crates);
instructions.forEach(instruction => warehouse2.moveTogether(instruction));
console.log(`Part 1: ${warehouse2.topView}`);
