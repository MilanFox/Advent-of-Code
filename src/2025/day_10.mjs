import { readFileSync } from 'node:fs';

const inputData = readFileSync('input.txt', 'utf-8').trim().split('\n').map(line => {
  const indicatorLights = line.match(/(?<=\[).*?(?=])/)[0].split('').map(char => char === '#' ? 1 : 0).join('');
  const numLights = indicatorLights.length;
  const indicatorLightValue = parseInt(indicatorLights, 2);

  const buttons = [...line.matchAll(/(?<=\().*?(?=\))/g)].map(m => m[0].split(',').map(Number));
  const buttonValueMasks = buttons.map(button => button.reduce((acc, i) => acc | (1 << (numLights - 1 - i)), 0));

  const joltageTarget = line.match(/(?<=\{).*?(?=})/)[0].split(',').map(Number);

  return { indicatorLightValue, buttonValueMasks, joltageTarget, buttons };
});

console.log(inputData.map(({ joltageTarget }) => joltageTarget.length));

const findFastestStartupSequence = ({ indicatorLightValue, buttonValueMasks }) => {
  const queue = [[0, 0]];
  const seen = new Set([0]);

  while (queue.length) {
    const [cur, presses] = queue.shift();

    if (cur === indicatorLightValue) return presses;

    for (const mask of buttonValueMasks) {
      const next = cur ^ mask;

      if (!seen.has(next)) {
        seen.add(next);
        queue.push([next, presses + 1]);
      }
    }
  }
};

const startupTime = inputData.map(findFastestStartupSequence).reduce((acc, cur) => acc + cur, 0);
console.log(`Part 1: ${startupTime}`);

class PriorityQueue {
  #heap = [];

  push(obj) {
    this.#heap.push(obj);
    this.#bubbleUp();
  }

  pop() {
    if (!this.#heap.length) return null;
    const min = this.#heap[0];
    const end = this.#heap.pop();
    if (this.#heap.length > 0) {
      this.#heap[0] = end;
      this.#bubbleDown();
    }
    return min;
  }

  #bubbleUp() {
    let currentIndex = this.#heap.length - 1;
    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);
      if (this.#heap[currentIndex].priority >= this.#heap[parentIndex].priority) break;
      [this.#heap[currentIndex], this.#heap[parentIndex]] = [this.#heap[parentIndex], this.#heap[currentIndex]];
      currentIndex = parentIndex;
    }
  }

  #bubbleDown() {
    let currentIndex = 0;
    const heapSize = this.#heap.length;
    while (true) {
      const leftIndex = 2 * currentIndex + 1;
      const rightIndex = 2 * currentIndex + 2;
      let smallest = currentIndex;
      if (leftIndex < heapSize && this.#heap[leftIndex].priority < this.#heap[smallest].priority) smallest = leftIndex;
      if (rightIndex < heapSize && this.#heap[rightIndex].priority < this.#heap[smallest].priority) smallest = rightIndex;
      if (smallest === currentIndex) break;
      [this.#heap[currentIndex], this.#heap[smallest]] = [this.#heap[smallest], this.#heap[currentIndex]];
      currentIndex = smallest;
    }
  }
}

const findFastestConfiguration = ({ joltageTarget, buttons }) => {
  const queue = new PriorityQueue();
  const getPriorityScore = (state) => state.reduce((acc, cur, i) => acc + joltageTarget[i] - cur, 0);
  const startState = Array(joltageTarget.length).fill(0);

  queue.push({ value: [startState, 0], priority: getPriorityScore(startState) });

  const seen = new Set([Array(joltageTarget.length).fill(0).join('-')]);

  while (true) {
    const { value: [cur, presses] } = queue.pop();

    if (cur.every((num, i) => num === joltageTarget[i])) return presses;

    for (const button of buttons) {
      const next = [...cur];
      for (const i of button) next[i] += 1;

      if (next.some((value, i) => value > joltageTarget[i])) continue;

      if (!seen.has(next.join('-'))) {
        seen.add(next.join('-'));
        queue.push({ value: [next, presses + 1], priority: getPriorityScore(next) });
      }
    }
  }
};

const configurationTime = inputData.map(findFastestConfiguration).reduce((acc, cur) => acc + cur, 0);
console.log(`Part 2: ${configurationTime}`); // Needs optimization. Apparently 10-Dimensional A* Pathfinding is still not performant enough... Keeping it until i have a better solution.
