import * as fs from 'node:fs';

const dirs = { U: [0, -1], R: [1, 0], D: [0, 1], L: [-1, 0] };

let instructions = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(instruction => {
    const [dir, length] = instruction.split(' ');
    return ({ dir, length: parseInt(length) });
  });

const getVisitedPositions = (ropeLength) => {
  const visited = new Set();
  const rope = Array.from({ length: ropeLength }, () => ([0, 0]));
  const head = rope[0];
  const tail = rope.at(-1);

  const advanceHead = (dir) => {
    head[0] = head[0] + dirs[dir][0];
    head[1] = head[1] + dirs[dir][1];
  };

  const isTouching = (value) => value >= -1 && value <= 1;

  const follow = (follower, target) => {
    const offset = [target[0] - follower[0], target[1] - follower[1]];
    if (offset.every(isTouching)) return;
    follower[0] += Math.sign(offset[0]);
    follower[1] += Math.sign(offset[1]);
  };

  const logVisited = (position) => {
    visited.add(`${position[0]}|${position[1]}`);
  };

  instructions.forEach(({ dir, length }) => {
    while (length--) {
      advanceHead(dir);
      for (let i = 1; i < rope.length; i++) follow(rope[i], rope[i - 1]);
      logVisited(tail);
    }
  });

  return visited.size;
};

console.log(`Part 1: ${getVisitedPositions(2)}`);
console.log(`Part 2: ${getVisitedPositions(10)}`);

