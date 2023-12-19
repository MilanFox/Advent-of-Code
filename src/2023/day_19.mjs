import * as fs from 'node:fs';

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .split('\n\n');

const [workflowData, partsData] = inputData;

class WorkInstruction {
  constructor(fullInstruction) {
    this.fullInstruction = fullInstruction;
    this.parse();
  }

  parse() {
    const regex = /([^\s<>]+)([<>])([^\s:]+):(.+)/;
    const match = this.fullInstruction.match(regex);

    if (match) {
      this.lhs = match[1];
      this.comparison = match[2];
      this.rhs = parseInt(match[3], 10);
      this.target = match[4];
    } else {
      this.fallback = true;
      this.target = this.fullInstruction;
    }
  }
}

const workflows = workflowData.split('\n').reduce((acc, cur) => {
  const name = cur.match(/^([^{}]+)\{/)[1];
  const instructions = cur.match(/\{([^{}]+)}/)[1].split(',').map(e => new WorkInstruction(e));
  return { ...acc, [name]: instructions };
}, {});

const parts = partsData.split('\n').filter(Boolean).map(part => part
  .substring(1, part.length - 1)
  .split(',')
  .reduce((acc, cur) => {
    const data = cur.split('=');
    const key = data[0];
    const value = parseInt(data[1], 10);
    return { ...acc, [key]: value };
  }, {}));

const isAccepted = (part) => {
  let curProcess = 'in';

  while (true) {
    if (curProcess === 'A') return true;
    if (curProcess === 'R') return false;

    for (const order of workflows[curProcess]) {
      if (order.fallback || (order.comparison === '<' && part[order.lhs] < order.rhs) || (order.comparison === '>' && part[order.lhs] > order.rhs)) {
        curProcess = order.target;
        break;
      }
    }
  }
};

const acceptedParts = parts.filter(isAccepted);

console.log(`Part 1: ${acceptedParts.reduce((acc, cur) => acc + cur.x + cur.m + cur.a + cur.s, 0)}`);
