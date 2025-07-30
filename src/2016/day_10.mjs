import { readFileSync } from 'node:fs';

class Output {
  constructor(id) {
    this.id = id;
    this.value = null;
  }

  values = {
    add: (val) => this.value = val,
  };
}

class Bot {
  constructor(id, value) {
    this.id = Number(id);
    if (value !== undefined) this.values.add(value);
  }

  values = new Set();
  targetLow = null;
  targetHigh = null;

  handOverMicrochips() {
    const [low, high] = [...this.values].toSorted((a, b) => a - b);
    this.targetLow.values.add(low);
    this.targetHigh.values.add(high);
    this.values.clear();
  }
}

class Factory {
  constructor(data) {
    data.forEach(instr => {
      if (instr.startsWith('value')) {
        const parser = /value (?<value>\d+) goes to bot (?<id>\d+)/;
        const { value, id } = parser.exec(instr).groups;
        if (!this.bots[id]) this.bots[id] = (new Bot(id, Number(value)));
        else (this.bots[id].values.add(Number(value)));
      }
      if (instr.startsWith('bot')) {
        const parser = /bot (?<id>\d+) gives low to (?<low>\w+ \d+) and high to (?<high>\w+ \d+)/;
        const { id, low, high } = parser.exec(instr).groups;
        if (!this.bots[id]) this.bots[id] = (new Bot(id));
        this.bots[id].targetLow = low;
        this.bots[id].targetHigh = high;
      }
    });

    const getElement = (name) => {
      const [type, id] = name.split(' ');
      if (type === 'bot') return this.bots[id];
      if (!this.outputs[id]) this.outputs[id] = new Output(Number(id));
      return this.outputs[id];
    };

    Object.values(this.bots).forEach(bot => {
      bot.targetLow = getElement(bot.targetLow);
      bot.targetHigh = getElement(bot.targetHigh);
    });
  }

  bots = {};
  outputs = {};

  run({ logAt }) {
    while (true) {
      const nextBot = Object.values(this.bots).find(bot => bot.values.size === 2);
      if (!nextBot) break;
      if (logAt.every(chipId => nextBot.values.has(chipId))) console.log(`Part 1: ${nextBot.id}`);
      nextBot.handOverMicrochips();
    }
  }

  get checkSum() {
    return this.outputs[0].value * this.outputs[1].value * this.outputs[2].value;
  }
}

const factory = new Factory(readFileSync('input.txt', 'utf-8').trim().split('\n'));

factory.run({ logAt: [61, 17] });
console.log(`Part 2: ${factory.checkSum}`);
