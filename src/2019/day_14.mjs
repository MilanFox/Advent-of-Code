import { readFileSync } from 'node:fs';

class Factory {
  constructor(recipes) {
    recipes.forEach(recipe => {
      const matches = [...recipe.matchAll(/(?<amount>\d+) (?<name>\w+)/g)].map(match => match.groups);

      const output = matches.pop();

      if (!this.resources[output.name]) {
        this.resources[output.name] = new Resource(output.name, output.amount);
      } else {
        this.resources[output.name].outputAmount = parseInt(output.amount, 10);
      }

      matches.forEach(({ name, amount }) => {
        if (!this.resources[name]) this.resources[name] = new Resource(name, null);
        this.resources[output.name].addRequiredInput(this.resources[name], amount);
      });
    });
  }

  resources = {};

  get totalOreNeeded() {
    return this.resources['ORE'].totalOreNeeded;
  }

  produce(ressourceName, amount) {
    this.resources[ressourceName].restock(amount);
  }
}

class Resource {
  constructor(name, amount) {
    this.name = name;
    this.outputAmount = amount ? parseInt(amount, 10) : amount;
    this.stock = 0;
    this.requirements = [];
  }

  addRequiredInput(resource, amount) {
    this.requirements.push({ resource, amountNeeded: parseInt(amount, 10) });
  }

  restock(amountNeeded = 1) {
    const shortfall = amountNeeded - this.stock;

    if (this.outputAmount === null) {
      this.stock += amountNeeded;
      this.totalOreNeeded ??= 0;
      this.totalOreNeeded += amountNeeded;
    }

    if (shortfall <= 0) {
      this.stock -= amountNeeded;
      return;
    }

    const batches = Math.ceil(shortfall / this.outputAmount);

    this.requirements.forEach(({ resource, amountNeeded }) => {
      resource.restock(batches * amountNeeded);
    });

    this.stock += batches * this.outputAmount - amountNeeded;
  }
}

const recipes = readFileSync('input.txt', 'utf-8').trim().split('\n');
const factory = new Factory(recipes);

factory.produce('FUEL', 1);
console.log(`Part 1: ${factory.totalOreNeeded}`);
