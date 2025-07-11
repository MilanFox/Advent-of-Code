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

  dumpResources() {
    Object.values(this.resources).forEach(resource => resource.stock = 0);
    this.resources['ORE'].totalOreNeeded = null;
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

const oreReserve = 1_000_000_000_000;

const findMaxFuel = (availableOre) => {
  let testAmount = 1;
  let neededOre = 0;

  while (neededOre < availableOre) {
    factory.dumpResources();
    testAmount *= 2;
    factory.produce('FUEL', testAmount);
    neededOre = factory.totalOreNeeded;
  }

  let lowerBounds = testAmount / 2;
  let upperBounds = testAmount;

  while (true) {
    factory.dumpResources();

    let midPoint = Math.floor((lowerBounds + upperBounds) / 2);
    factory.produce('FUEL', midPoint);
    const oreConsumptionAtMidPoint = factory.totalOreNeeded;

    if (oreConsumptionAtMidPoint === availableOre) return midPoint;
    if (oreConsumptionAtMidPoint > availableOre) upperBounds = midPoint - 1;
    else lowerBounds = midPoint + 1;

    if (lowerBounds > upperBounds) return upperBounds;
  }
};

console.log(`Part 2: ${findMaxFuel(oreReserve)}`);
