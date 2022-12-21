import * as fs from 'node:fs';

class Monkey {
  constructor(inputData) {
    const [name, data] = inputData.split(': ');
    this.name = name;

    const operations = data.split(' ');
    if (operations.length === 1) this.number = parseInt(operations); else [this.monkeyA, this.operand, this.monkeyB] = operations;
  }

  calculateNumber() {
    if (this.number) return this.number;
    const numberA = monkeys[this.monkeyA]?.number;
    const numberB = monkeys[this.monkeyB]?.number;
    this.number = eval(`${numberA}${this.operand}${numberB}`);
  }
}

const monkeys = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(data => new Monkey(data))
  .reduce((acc, cur) => ({ ...acc, [cur.name]: cur }), {});

while (!monkeys.root.number) Object.values(monkeys).filter(monkey => !monkey.number).forEach(monkey => monkey.calculateNumber());

console.log(`Part 1: ${monkeys.root.number}`);
