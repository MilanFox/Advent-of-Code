import fs from 'fs';

const wordSearch = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(row => row.split(''));

const orthogonals = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const diagonals = [[1, -1], [1, 1], [-1, 1], [-1, -1]];
const directions = [...orthogonals, ...diagonals];

const perCell = (cb) => {
  wordSearch.forEach((row, y) => row.forEach((_, x) => cb(x, y)));
};

let XMASCount = 0;

perCell((x, y) => {
  for (const [dirX, dirY] of directions) {
    const letters = Array.from({ length: 4 }, (_, i) => wordSearch[y + (i * dirX)]?.[x + (i * dirY)]).join('');
    if (letters === 'XMAS') XMASCount++;
  }
});

console.log(`Part 1: ${XMASCount}`);

let xMASCount = 0;

const hasLetters = (arr, char, count) => arr.filter(c => c === char).length === count;

perCell((x, y) => {
  if (!(wordSearch[y][x] === 'A')) return;

  const letters = diagonals.map(([dirX, dirY]) => wordSearch[y + dirY]?.[x + dirX]);
  if (!hasLetters(letters, 'M', 2) || !hasLetters(letters, 'S', 2)) return;

  const areMsTouching = () => {
    const mIndexes = letters.map((c, i) => c === 'M' ? i : -1).filter(i => i !== -1);
    return (mIndexes[1] - mIndexes[0] === 1) || (mIndexes[1] - mIndexes[0] === letters.length - 1);
  };
  if (!areMsTouching()) return;

  xMASCount++;
});

console.log(`Part 2: ${xMASCount}`);
