import * as fs from 'node:fs';

const queue = [];
const counter = { low: 0, high: 0 };

class Module {
  constructor(moduleData) {
    this.moduleData = moduleData;
    this.parse();
  }

  parse() {
    const [module, targets] = this.moduleData.split(' -> ');
    this.targets = targets.split(',').map(target => target.trim());

    switch (module[0]) {
      case '%':
        this.isFlipFlopModule = true;
        this.state = false;
        break;
      case '&':
        this.isConjunctionModule = true;
        this.state = {};
        break;
      default:
        this.isBroadcastModule = true;
    }

    this.name = this.isBroadcastModule ? module : module.substring(1, module.length);
  }

  triggerLowPulse(inputModule) {
    if (this.isFlipFlopModule) {
      this.state = !this.state;
      this.queuePulse(this.targets, this.state === true ? 'high' : 'low');
      return;
    }

    if (this.isConjunctionModule) {
      this.state[inputModule] = 'low';
      this.queuePulse(this.targets, Object.values(this.state).every(lvl => lvl === 'high') ? 'low' : 'high');
      return;
    }

    if (this.isBroadcastModule) {
      this.queuePulse(this.targets, 'low');
      return;
    }
  };

  triggerHighPulse(comingFrom) {
    if (this.isConjunctionModule) {
      this.state[comingFrom] = 'high';
      this.queuePulse(this.targets, Object.values(this.state).every(lvl => lvl === 'high') ? 'low' : 'high');
      return;
    }

    if (this.isBroadcastModule) {
      this.queuePulse(this.targets, 'high');
      return;
    }
  };

  queuePulse(targets, level) {
    targets.forEach(target => {
      queue.push([this.name, level, target]);
      counter[level] += 1;
    });
  };

  findInputModules(allModules) {
    this.inputModules = allModules
      .filter(module => module.targets.includes(this.name))
      .map(module => module.name);

    if (this.isConjunctionModule) {
      this.inputModules.forEach(moduleName => this.state[moduleName] = 'low');
    }
  }
}

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(module => new Module(module))
  .reduce((acc, cur) => ({ ...acc, [cur.name]: cur }), {});

const initializeConjunctionModules = (dataSet) => {
  Object.values(dataSet).forEach(module => {
    module.findInputModules(Object.values(dataSet));
  });
};

const triggerPulse = ([sender, level, target], cycles) => {
  for (let i = 0; i < cycles; i++) {
    queue.push([sender, level, target]);
    counter.low += 1;
    while (queue.length > 0) {
      const [sender, level, target] = queue.shift();
      if (!inputData[target]) continue;
      if (level === 'low') inputData[target].triggerLowPulse(sender); else inputData[target].triggerHighPulse(sender);
    }
  }
};

initializeConjunctionModules(inputData);
triggerPulse([undefined, 'low', 'broadcaster'], 1000);

console.log(`Part 1: ${counter.high * counter.low}`);
