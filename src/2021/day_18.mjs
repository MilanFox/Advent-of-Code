import { readFileSync } from 'node:fs';

class SnailfishNumber {
  constructor(data, depth = 0, parent = null) {
    this.depth = depth;

    if (data.at(1) === '[') {
      let tally = 1;
      let p = 1;

      while (tally > 0) {
        p += 1;
        if (data[p] === '[') tally++;
        if (data[p] === ']') tally--;
      }

      this.x = new SnailfishNumber(data.slice(1, p + 1), depth + 1, this);
    } else {
      let ci = 2;
      while (data[ci] !== ',') ci++;
      this.x = Number(data.slice(1, ci));
    }

    if (data.at(-2) === ']') {
      let tally = 1;
      let p = 2;

      while (tally > 0) {
        p += 1;
        if (data[data.length - p] === ']') tally++;
        if (data[data.length - p] === '[') tally--;
      }

      this.y = new SnailfishNumber(data.slice(data.length - p, data.length - 1), depth + 1, this);
    } else {
      let ci = data.length - 2;
      while (data[ci] !== ',') ci--;
      this.y = Number(data.slice(ci + 1, data.length - 1));
    }

    this.parent = parent;
  }

  get isExplodable() {
    return !(this.depth < 4 || typeof this.y !== 'number' || typeof this.x !== 'number');
  }

  #explode(node, dir, num) {
    if (!node) return;
    if (typeof node[dir] === 'number') {
      node[dir] += num;
      return;
    }
    this.#explodeDeep(node[dir], dir === 'x' ? 'y' : 'x', num);
  }

  #explodeDeep(node, dir, num) {
    if (typeof node[dir] === 'number') {
      node[dir] += num;
      return;
    }
    this.#explodeDeep(node[dir], dir, num);
  }

  #tryExplode() {
    let explodablePair = null;
    const stack = [{ node: this, lastLeftTurn: null, lastRightTurn: null, dir: null }];

    while (stack.length) {
      const { node: currentPair, lastLeftTurn, lastRightTurn, dir } = stack.pop();

      if (currentPair.isExplodable) {
        explodablePair = { node: currentPair, lastLeftTurn, lastRightTurn, dir };
        break;
      }

      if (currentPair.y instanceof SnailfishNumber) stack.push({
        node: currentPair.y,
        lastLeftTurn,
        lastRightTurn: currentPair,
        dir: 'y',
      });

      if (currentPair.x instanceof SnailfishNumber) stack.push({
        node: currentPair.x,
        lastLeftTurn: currentPair,
        lastRightTurn,
        dir: 'x',
      });
    }

    if (!explodablePair) return false;

    explodablePair.node.parent[explodablePair.dir] = 0;
    this.#explode(explodablePair.lastRightTurn, 'x', explodablePair.node.x);
    this.#explode(explodablePair.lastLeftTurn, 'y', explodablePair.node.y);

    return true;
  }

  #trySplit(node = this) {
    if (node.x >= 10) {
      node.x = new SnailfishNumber(`[${Math.floor(node.x / 2)},${Math.ceil(node.x / 2)}]`, node.depth + 1, node);
      return true;
    }

    if (node.x instanceof SnailfishNumber && this.#trySplit(node.x)) return true;

    if (node.y >= 10) {
      node.y = new SnailfishNumber(`[${Math.floor(node.y / 2)},${Math.ceil(node.y / 2)}]`, node.depth + 1, node);
      return true;
    }

    if (node.y instanceof SnailfishNumber && this.#trySplit(node.y)) return true;

    return false;
  }

  reduce() {
    while (true) {
      const hasExploded = this.#tryExplode();
      if (hasExploded) continue;

      const hasSplit = this.#trySplit();
      if (hasSplit) continue;

      return this.toString();
    }
  }

  toString() {
    return `[${this.x.toString()},${this.y.toString()}]`;
  }

  get magnitude() {
    const x = this.x instanceof SnailfishNumber ? this.x.magnitude : this.x;
    const y = this.y instanceof SnailfishNumber ? this.y.magnitude : this.y;
    return 3 * x + 2 * y;
  }
}

const homework = readFileSync('input.txt', 'utf-8').trim().split('\n');

const add = (list) => {
  let result = list[0];
  for (let i = 1; i < list.length; i++) {
    result = new SnailfishNumber(`[${result},${list[i]}]`);
    result.reduce();
  }
  return result;
};

console.log(`Part 1: ${add(homework).magnitude}`);

const getAllCombinations = (arr) => arr.flatMap((a, i) => arr.filter((_, j) => j !== i).map(b => [a, b]));

const pairings = getAllCombinations(homework);
const highestPossibleMagnitude = pairings.reduce((acc, cur) => Math.max(acc, add(cur).magnitude), 0);

console.log(`Part 2: ${highestPossibleMagnitude}`);
