import { readFileSync } from 'node:fs';

class Step {
  constructor(id) {
    this.id = id;
    this.requiredTime = id.charCodeAt(0) - 4;
  }

  prerequisites = [];

  get isReady() {
    return this.prerequisites.every(step => step.isDone);
  }

  get isDone() {
    return instructionOrder.has(this);
  }

  get isBeingWorkedOn() {
    return workers.some(worker => worker.step === this);
  }
}

class Worker {
  constructor() {}

  step = null;
  busyTime = 0;

  get isBusy() {
    return Boolean(this.step);
  }

  assignTo(step) {
    this.step = step;
    this.busyTime = step.requiredTime;
  }

  passSecond() {
    if (this.step === null) return;
    this.busyTime -= 1;

    if (this.busyTime === 0) {
      instructionOrder.add(this.step);
      this.step = null;
    }
  };
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

instructionOrder.clear();

const workers = Array.from({ length: 5 }, () => new Worker());

let totalTime = 0;

while (instructionOrder.size < Object.keys(steps).length) {
  const freeWorkers = workers.filter(worker => !worker.isBusy);
  freeWorkers.forEach(worker => {
    const availableSteps = Object.values(steps).filter(step => !step.isDone && step.isReady && !step.isBeingWorkedOn);
    if (availableSteps.length) worker.assignTo(availableSteps.at(0));
  });
  workers.forEach(worker => worker.passSecond());
  totalTime += 1;
}

console.log(`Part 2: ${totalTime}`);
