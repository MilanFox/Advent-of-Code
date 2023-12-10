import * as fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').split('\n').filter(Boolean).map(line => line.split(''));

const directions = {
  'north': { opposite: 'south', offsetX: 0, offsetY: -1 },
  'east': { opposite: 'west', offsetX: 1, offsetY: 0 },
  'south': { opposite: 'north', offsetX: 0, offsetY: 1 },
  'west': { opposite: 'east', offsetX: -1, offsetY: 0 },
};

const pipes = {
  'S': { connectsTo: ['north', 'west', 'east', 'south'] },
  '|': { connectsTo: ['north', 'south'] },
  '-': { connectsTo: ['west', 'east'] },
  'L': { connectsTo: ['north', 'east'] },
  'J': { connectsTo: ['north', 'west'] },
  '7': { connectsTo: ['west', 'south'] },
  'F': { connectsTo: ['east', 'south'] },
};

const startY = inputData.findIndex(line => line.includes('S'));
const startX = inputData[startY].findIndex(char => char === 'S');
const nodes = [];
let lastVisited = undefined;

while (true) {
  const { char, x, y } = nodes.at(-1) || { char: 'S', x: startX, y: startY };
  if (char === 'S' && nodes.length) break;

  for (let i = 0; i < pipes[char].connectsTo.length; i++) {
    const searchDirection = pipes[char].connectsTo[i];
    const { offsetX, offsetY } = directions[searchDirection];
    const nextChar = inputData[y + offsetY][x + offsetX];

    if (searchDirection === lastVisited) continue;
    if (!Object.keys(pipes).includes(nextChar)) continue;
    if (!pipes[nextChar].connectsTo.includes(directions[searchDirection].opposite)) continue;

    nodes.push({ char: nextChar, x: x + offsetX, y: y + offsetY });
    lastVisited = directions[searchDirection].opposite;

    break;
  }
}

console.log(`Part 1: ${nodes.length / 2}`);

const visualizationData = Array.from({ length: inputData.length }, () => Array(inputData[0].length).fill(' '));
const speakingCharacters = { 'S': '★', '|': '│', '-': '─', 'L': '╰', 'J': '╯', '7': '╮', 'F': '╭' };
nodes.forEach(({ char, y, x }) => visualizationData[y][x] = speakingCharacters[char]);
const generateVisualisation = (data) => data.map(line => line.join('')).join('\n');
fs.writeFileSync('visualization.txt', generateVisualisation(visualizationData), { flag: 'w+' });

const upscaleMatrix = (matrix) => {
  const upscaleMap = {
    ' ': [[' ', ' ', ' '], [' ', '╳', ' '], [' ', ' ', ' ']],
    '★': [['╭', '─', '╮'], ['│', '★', '│'], ['╰', '─', '╯']],
    '│': [[' ', '│', ' '], [' ', '│', ' '], [' ', '│', ' ']],
    '─': [[' ', ' ', ' '], ['─', '─', '─'], [' ', ' ', ' ']],
    '╰': [[' ', '│', ' '], [' ', '╰', '─'], [' ', ' ', ' ']],
    '╯': [[' ', '│', ' '], ['─', '╯', ' '], [' ', ' ', ' ']],
    '╮': [[' ', ' ', ' '], ['─', '╮', ' '], [' ', '│', ' ']],
    '╭': [[' ', ' ', ' '], [' ', '╭', '─'], [' ', '│', ' ']],
  };

  const upscaledMatrix = Array.from({ length: matrix.length * 3 }, () => Array(matrix[0].length * 3).fill('.'));
  matrix.forEach((row, indexY) => {
    row.forEach((cell, indexX) => {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          upscaledMatrix[(indexY * 3) + i][(indexX * 3) + j] = upscaleMap[cell][i][j];
        }
      }
    });
  });
  
  return upscaledMatrix;
};

const fillStack = [];
const floodFill = (matrix, posY, posX) => {
  fillStack.push([posY, posX]);
  while (fillStack.length > 0) {
    const [posY, posX] = fillStack.pop();
    if (!matrix[posY]) continue;
    if (matrix[posY][posX] !== ' ' && matrix[posY][posX] !== '╳') continue;
    matrix[posY][posX] = ' '; // Overwriting ' ' with '&nbsp;', so we don't run into infinite loops while still looking like a space in the render.
    for (const direction in directions) {
      fillStack.push([posY + directions[direction].offsetY, posX + directions[direction].offsetX]);
    }
  }
};

const upscaledMatrix = upscaleMatrix(visualizationData);
floodFill(upscaledMatrix, 0, 0);
const charactersInLoop = upscaledMatrix.reduce((acc, row) => acc + row.filter(cell => cell === '╳').length, 0);

console.log(`Part 2: ${charactersInLoop}`);
fs.writeFileSync('visualization2.txt', generateVisualisation(upscaledMatrix), { flag: 'w+' });
