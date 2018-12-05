import * as fs from 'node:fs';

class Polymer {
  constructor(chain) {
    this.chain = [...chain];
  }

  react() {
    const stack = [];
    const chain = [...this.chain];
    for (const unit of chain) {
      const lastUnit = stack[stack.length - 1];
      if (lastUnit && lastUnit !== unit && lastUnit.toUpperCase() === unit.toUpperCase()) {
        stack.pop();
      } else {
        stack.push(unit);
      }
    }
    return stack;
  }

  removeUnit(unit) {
    const filteredChain = this.chain.filter(u => u.toLowerCase() !== unit.toLowerCase());
    return new Polymer(filteredChain);
  }
}

const polymer = new Polymer(fs.readFileSync('input.txt', 'utf-8').trim());

const reactedPolymer = polymer.react();
console.log(`Part 1: ${reactedPolymer.length}`);

const findSmallestPossiblePolymer = () => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let shortestLength = reactedPolymer.length;

  for (const unit of alphabet) {
    const modifiedPolymer = polymer.removeUnit(unit);
    const reactedModifiedPolymer = modifiedPolymer.react();
    shortestLength = Math.min(shortestLength, reactedModifiedPolymer.length);
  }

  return shortestLength;
};

console.log(`Part 2: ${findSmallestPossiblePolymer()}`);
