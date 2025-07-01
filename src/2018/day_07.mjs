import { readFileSync } from 'node:fs';

class Step {
  constructor(id) {
    this.id = id;
  }

  prerequisites = [];

  get isReady() {
    return this.prerequisites.every(step => step.isDone);
  }

  get isDone() {
    return instructionOrder.has(this);
  }
}

const instructions = readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(line => {
    const [_, prerequisite, step] = line.match(/Step ([A-Z]) .* step ([A-Z]) /i);
    return { prerequisite, step };
  });

const steps = Object.fromEntries(
  [...new Set(instructions.flatMap(data => Object.values(data)).sort())]
    .map(id => [id, new Step(id)]),
);

instructions.forEach(({ prerequisite, step }) => steps[step].prerequisites.push(steps[prerequisite]));

const instructionOrder = new Set;

while (instructionOrder.size < Object.keys(steps).length) {
  const availableSteps = Object.values(steps).filter(step => !step.isDone && step.isReady);
  instructionOrder.add(availableSteps.at(0));
}

console.log(`Part 1: ${[...instructionOrder].map(step => step.id).join('')}`);
