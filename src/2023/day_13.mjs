import * as fs from 'node:fs';

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n\n')
  .map(chunk => {
    const rows = chunk.trim().split('\n');
    const columns = Array.from({ length: rows[0].length }, (value, i) => rows.reduce((acc, cur) => acc + cur[i], ''));
    return { rows, columns };
  });

const symmetries = inputData.map(({ rows, columns }) => {
  let symmetryScore = undefined;
  const checkForSymmetry = (stack, multiplier, start = 1, position = 0) => {
    const a = stack[start - position - 1];
    const b = stack[start + position];
    if (!a || !b) return;
    if (a !== b) {
      symmetryScore = undefined;
      if (start !== stack.length - 1) checkForSymmetry(stack, multiplier, start + 1);
      return;
    }
    symmetryScore = start * multiplier;
    checkForSymmetry(stack, multiplier, start, position + 1);
  };

  checkForSymmetry(rows, 100);
  if (!symmetryScore) checkForSymmetry(columns, 1);
  return symmetryScore;
});

console.log(`Part 1: ${symmetries.reduce((acc, cur) => acc + cur, 0)}`);

const smudgeSymmetries = inputData.map(({ rows, columns }, chunkIndex) => {
  let symmetryScore = undefined;

  const checkForSymmetry = (stack, multiplier, start = 1, position = 0, diff = 0) => {
    const a = stack[start - position - 1];
    const b = stack[start + position];

    if (!a || !b) return;

    if (symmetries[chunkIndex] / multiplier === start) {
      if (start !== stack.length - 1) checkForSymmetry(stack, multiplier, start + 1);
      return;
    }

    for (let i = 0; i < a.length; i++) {
      if (diff > 1) break;
      if (a[i] !== b[i]) diff += 1;
    }

    if (diff > 1) {
      symmetryScore = undefined;
      if (start !== stack.length - 1) checkForSymmetry(stack, multiplier, start + 1);
      return;
    }

    symmetryScore = start * multiplier;
    checkForSymmetry(stack, multiplier, start, position + 1);
  };

  checkForSymmetry(rows, 100);
  if (!symmetryScore) checkForSymmetry(columns, 1);
  return symmetryScore;
});

console.log(`Part 2: ${smudgeSymmetries.reduce((acc, cur) => acc + cur, 0)}`);
