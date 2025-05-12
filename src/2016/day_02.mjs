import { readFileSync } from 'node:fs';

const inputData = readFileSync('input.txt', 'utf-8').trim().split('\n').map(instr => instr.split(''));

const keypadA = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const keypadB = [
  [null, null, 1],
  [null, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [null, 'A', 'B', 'C'],
  [null, null, 'D'],
];

const moveInstruction = {
  U: { row: -1, col: 0 },
  R: { row: 0, col: 1 },
  D: { row: 1, col: 0 },
  L: { row: 0, col: -1 },
};

const currentPos = { row: 1, col: 1 };

const findKey = (keypad, instructions) => {
  instructions.forEach(instr => {
    const nextRow = currentPos.row + moveInstruction[instr].row;
    const nextCol = currentPos.col + moveInstruction[instr].col;
    if (!keypad[nextRow]?.[nextCol]) return;
    currentPos.row = nextRow;
    currentPos.col = nextCol;
  });
  return keypad[currentPos.row][currentPos.col];
};

const codeA = inputData.map(instr => findKey(keypadA, instr)).join('');
console.log(`Part 1: ${codeA}`);

currentPos.row = 2;
currentPos.col = 0;

const codeB = inputData.map(instr => findKey(keypadB, instr)).join('');
console.log(`Part 2: ${codeB}`);
