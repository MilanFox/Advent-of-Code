import { readFileSync } from 'node:fs';

/**
 * @see https://www.youtube.com/watch?v=pLIajuc31qk
 */
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

const inputData = readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(floor => {
    const parser = /(?<element>\w+)(?:-compatible)? (?<type>generator|microchip)/g;
    return [...floor.matchAll(parser)].map(m => ({ ...m.groups }));
  });

let elements = [...new Set(inputData.flat().map(({ element }) => element).toSorted())];

let originalItemMap = elements.map(el => [
  inputData.findIndex(floor => floor.some(({ element, type }) => element === el && type === 'microchip')),
  inputData.findIndex(floor => floor.some(({ element, type }) => element === el && type === 'generator')),
]);

const getFastestRoute = (initState) => {
  const getHash = (itemMap, elevatorLevel) => {
    const normalized = [...itemMap]
      .map(([chip, gen]) => `${chip},${gen}`)
      .sort()
      .join(';');
    return `${elevatorLevel}|${normalized}`;
  };

  const isLegal = (itemMap) => itemMap.every(([chipFloor, genFloor]) => chipFloor === genFloor || !itemMap.some(([_, otherGenFloor]) => otherGenFloor === chipFloor));

  const isComplete = (itemMap) => itemMap.every(([chip, gen]) => chip === 3 && gen === 3);

  const getPriority = (state) => state.reduce((sum, [chip, gen]) => sum + (3 - chip) + (3 - gen), 0);

  const getPermutations = (set) => {
    const result = [];
    for (let i = 0; i < set.length; i++) {
      for (let j = i + 1; j < set.length; j++) {
        result.push([set[i], set[j]]);
      }
    }
    return [...set.map(el => [el]), ...result];
  };

  const visited = new Map();

  const queue = new PriorityQueue();
  queue.push({ value: [initState, 0, 0], priority: getPriority(initState) });

  let fastestKnownRoute = Infinity;

  while (true) {
    const current = queue.pop();
    if (!current) break;

    const [state, elevatorLevel, steps] = current.value;
    if (steps >= fastestKnownRoute) continue;

    if (isComplete(state)) {
      fastestKnownRoute = steps;
      continue;
    }

    const hash = getHash(state, elevatorLevel);

    if (visited.has(hash) && visited.get(hash) <= steps) continue;
    visited.set(hash, steps);

    const itemsOnTheCurrentFloor = state.reduce((acc, [chipFloor, genFloor], i) => {
      if (chipFloor === elevatorLevel) acc.push([i, 0]);
      if (genFloor === elevatorLevel) acc.push([i, 1]);
      return acc;
    }, []);

    const movableCombinations = getPermutations(itemsOnTheCurrentFloor);

    movableCombinations.forEach(combinations => {
      if (elevatorLevel < 3) {
        const nextState = structuredClone(state);
        for (const [element, type] of combinations) nextState[element][type] += 1;
        if (isLegal(nextState)) {
          queue.push({ value: [nextState, elevatorLevel + 1, steps + 1], priority: steps + getPriority(nextState) });
        }
      }

      if (elevatorLevel > 0) {
        const nextState = structuredClone(state);
        for (const [element, type] of combinations) nextState[element][type] -= 1;
        if (isLegal(nextState)) {
          queue.push({ value: [nextState, elevatorLevel - 1, steps + 1], priority: steps + getPriority(nextState) });
        }
      }
    });
  }

  return fastestKnownRoute;
};

const fastestRoute = getFastestRoute(originalItemMap);
console.log(`Part 1: ${fastestRoute}`);

const fastestRoute2 = getFastestRoute([...originalItemMap, [0, 0], [0, 0]]);
console.log(`Part 2: ${fastestRoute2}`);
