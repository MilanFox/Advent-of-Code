import * as fs from 'node:fs';

class Polymer {
  constructor(template, instructions) {
    this.recipe = template;
    this.instructionList = instructions;
    this.pairQuantity = {};

    for (let i = 0; i < this.recipe.length - 1; i++) {
      const pair = this.recipe.substring(i, i + 2);
      this.pairQuantity[pair] = (this.pairQuantity[pair] || 0) + 1;
    }
  }

  executeInstructions() {
    const nextQuantity = { ...this.pairQuantity };

    this.instructionList.forEach(({ sourcePair, targetPairs }) => {
      const matches = this.pairQuantity[sourcePair];
      if (matches !== undefined && matches > 0) {
        nextQuantity[sourcePair] -= matches;
        targetPairs.forEach(pair => {
          if (nextQuantity[pair] === undefined) nextQuantity[pair] = 0;
          nextQuantity[pair] += matches;
        });
      }
    });

    this.pairQuantity = nextQuantity;
  }

  grow(n) {
    for (let i = 0; i < n; i++) this.executeInstructions();
  }

  get elementQuantity() {
    const quantity = {};

    Object.entries(this.pairQuantity).forEach(([pair, count]) => {
      const [a, b] = pair.split('');
      quantity[a] = (quantity[a] || 0) + count;
      quantity[b] = (quantity[b] || 0) + count;
    });

    quantity[this.recipe[0]] = (quantity[this.recipe[0]] || 0) + 1;
    quantity[this.recipe.at(-1)] = (quantity[this.recipe.at(-1)] || 0) + 1;
    for (const key in quantity) quantity[key] /= 2;

    return quantity;
  }
}

class InsertionRule {
  constructor(data) {
    const [pattern, insert] = data.split(' -> ');
    this.sourcePair = pattern;
    this.insert = insert;
    this.targetPairs = [`${pattern[0]}${insert}`, `${insert}${pattern[1]}`];
  }
}

const [template, instruction] = fs.readFileSync('input.txt', 'utf-8').trim().split('\n\n');
const polymer = new Polymer(template, instruction.split('\n').map(data => new InsertionRule(data)));

polymer.grow(10);
let quantityDistribution = Object.entries(polymer.elementQuantity).map(([_, quantity]) => quantity).sort((a, b) => a - b);
console.log(`Part 1: ${quantityDistribution.at(-1) - quantityDistribution.at(0)}`);

polymer.grow(30);
quantityDistribution = Object.entries(polymer.elementQuantity).map(([_, quantity]) => quantity).sort((a, b) => a - b);
console.log(`Part 2: ${quantityDistribution.at(-1) - quantityDistribution.at(0)}`);
