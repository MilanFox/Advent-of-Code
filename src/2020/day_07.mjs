import * as fs from 'node:fs';

class Rules {
  constructor(data) {
    this.bags = data.split('\n').map(data => new Bag(data));
    this.bags.forEach(bag => bag.content.forEach(entry => entry[1] = this.bags.find(el => el.color === entry[1])));
  }
}

class Bag {
  constructor(data) {
    const [color, content] = data.split(' bags contain ');
    this.color = color;
    this.content = content.split(', ').filter(desc => desc !== 'no other bags.').map(desc => [desc[0], desc.split(' ').slice(1, 3).join(' ')]);
  }

  get canContainGoldenBag() {
    const queue = [this];
    while (queue.length) {
      const bag = queue.shift();
      if (bag.content.some(([_, el]) => el.color === 'shiny gold')) return true;
      bag.content.forEach(([_, el]) => queue.push(el));
    }

    return false;
  }

  get size() {
    if (this.totalSize) return this.totalSize;
    if (!this.content.length) {
      this.totalSize = 1;
      return this.totalSize;
    } else {
      this.totalSize = 1 + this.content.reduce((acc, [count, el]) => acc + count * el.size, 0);
      return this.totalSize;
    }
  }

  get contentSize() {
    return this.size - 1;
  }
}

const rules = new Rules(fs.readFileSync('input.txt', 'utf-8').trim());

console.log(`Part 1: ${rules.bags.filter(bag => bag.canContainGoldenBag).length}`);
console.log(`Part 2: ${rules.bags.find(({ color }) => color === 'shiny gold').contentSize}`);
