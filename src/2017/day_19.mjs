import * as fs from 'node:fs';

const tubes = fs.readFileSync('input.txt', 'utf-8').trimEnd().split('\n').map(row => [...row]);

const findNextDirection = (cur, last) => {
  const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  for (const [i, [offsetX, offsetY]] of directions.entries()) {
    const [X, Y] = [cur.x + offsetX, cur.y + offsetY];
    const isInBounds = Y >= 0 && Y < tubes.length && X >= 0 && X < tubes[cur.y].length;
    if (!isInBounds) continue;
    const hasTube = tubes[Y][X] !== ' ' && tubes[Y][X] !== undefined;
    const isPrevDirection = last[0] === directions[(i + 2) % 4][0] && last[1] === directions[(i + 2) % 4][1];
    if (hasTube && !isPrevDirection) return [offsetX, offsetY];
  }
  return null;
};

const moveToNextBend = (cur, direction) => {
  const encounters = [];
  let steps = 0;

  while (true) {
    steps++;
    cur.x += direction[0];
    cur.y += direction[1];
    const tube = tubes[cur.y][cur.x];
    if (/^[a-zA-Z]$/.test(tube)) encounters.push(tube);

    const curIsBend = tube === '+';
    if (curIsBend) break;

    const next = { y: cur.y + direction[1], x: cur.x + direction[0] };
    const nextIsInBounds = next.y >= 0 && next.y < tubes.length && next.x >= 0 && next.x < tubes[next.y].length;
    if (!nextIsInBounds) break;

    const nextIsEmpty = tubes[next.y][next.x] === ' ' || tubes[next.y][next.x] === undefined;
    if (nextIsEmpty) break;
  }
  return { encounters, steps };
};

const followTube = () => {
  const cur = { x: tubes[0].length - 1, y: 0 };
  let direction = [0, 1];
  const encounteredCharacters = [];
  let totalSteps = 1;

  while (true) {
    direction = findNextDirection(cur, direction);
    if (direction === null) break;
    const { encounters, steps } = moveToNextBend(cur, direction);
    encounteredCharacters.push(...encounters);
    totalSteps += steps;
  }

  return { encounteredCharacters, totalSteps };
};

const { encounteredCharacters, totalSteps } = followTube();

console.log(`Part 1: ${encounteredCharacters.join('')}`);
console.log(`Part 2: ${totalSteps}`);

