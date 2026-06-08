import * as fs from 'node:fs';

class Monkey {
  constructor(data) {
    const [dataID, dataItems, dataOperation, dataTest, dataTrue, dataFalse] = data.split('\n');
    this.id = parseInt(dataID.match((/\d+/))[0]);
    this.items = dataItems.split(': ')[1].split(', ').map(Number);
    this.test = parseInt(dataTest.match((/\d+/))[0]);
    this.operation = dataOperation.split('= ')[1].split(' ');
    this.ifTrue = parseInt(dataTrue.match((/\d+/))[0]);
    this.ifFalse = parseInt(dataFalse.match((/\d+/))[0]);
    this.inspectedItems = 0;
  }

  getNewWorryLevel(item) {
    const num1 = this.operation[0] === 'old' ? item : parseInt(this.operation[0], 10);
    const num2 = this.operation[2] === 'old' ? item : parseInt(this.operation[2], 10);
    const op = this.operation[1];
    return eval(`${num1}${op}${num2}`);
  }

  throwNextItem(monkeys, relief = true, modulo = Infinity) {
    this.inspectedItems += 1;
    const item = this.items.shift();

    let worryLevel = this.getNewWorryLevel(item);
    if (relief) worryLevel = Math.floor(worryLevel / 3);
    worryLevel %= modulo;

    const nextMonkey = worryLevel % this.test === 0 ? this.ifTrue : this.ifFalse;
    monkeys.find(monkey => monkey.id === nextMonkey).addItem(worryLevel);
  }

  addItem(item) {
    this.items.push(item);
  }
}

let inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .split('\n\n');

const simulateRounds = (rounds, relief = true) => {
  const monkeys = inputData.map(monkeyData => new Monkey(monkeyData));
  const modulo = monkeys.reduce((acc, monkey) => acc * monkey.test, 1);

  for (let i = 0; i < rounds; i++) {
    monkeys.forEach(monkey => {
      while (monkey.items.length) {
        monkey.throwNextItem(monkeys, relief, modulo);
      }
    });
  }

  return monkeys;
};

const getMonkeyBusiness = (monkeys) => {
  const [monkeyA, monkeyB] = monkeys.toSorted((a, b) => b.inspectedItems - a.inspectedItems);
  return monkeyA.inspectedItems * monkeyB.inspectedItems;
};

console.log(`Part 1: ${getMonkeyBusiness(simulateRounds(20))}`);
console.log(`Part 2: ${getMonkeyBusiness(simulateRounds(10000, false))}`);
