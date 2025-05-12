import { readFileSync } from 'node:fs';

const inputData = readFileSync('input.txt', 'utf-8').trim().split('\n').map(instr => instr.split(''));

const keypad = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const moveInstruction = {
  U: { row: -1, col: 0 },
  R: { row: 0, col: 1 },
  D: { row: 1, col: 0 },
  L: { row: 0, col: -1 },
};

const clampToKeyboard = (pos) => {
  pos.row = Math.max(Math.min(pos.row, 2), 0);
  pos.col = Math.max(Math.min(pos.col, 2), 0);
};

const currentPos = { row: 1, col: 1 };

const findKey = (instructions) => {
  instructions.forEach(instr => {
    currentPos.row += moveInstruction[instr].row;
    currentPos.col += moveInstruction[instr].col;
    clampToKeyboard(currentPos);
  });
  return keypad[currentPos.row][currentPos.col];
};

console.log(`Part 1: ${inputData.map(findKey).join('')}`);
