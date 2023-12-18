import * as fs from 'node:fs';

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(line => {
    const [dir, length, color] = line.split(' ');
    return { dir, length: parseInt(length, 10), color: color.substring(1, color.length - 1) };
  });

const directions = {
  'U': { offsetX: 0, offsetY: -1 },
  'R': { offsetX: 1, offsetY: 0 },
  'D': { offsetX: 0, offsetY: 1 },
  'L': { offsetX: -1, offsetY: 0 },
};

const digSiteSize = Object.values(inputData).reduce((acc, cur) => {
  let newSize = {};
  Object.entries(directions).forEach(([key, value]) => {
    if (cur.dir === key) newSize = {
      width: acc.width + cur.length * value.offsetX, height: acc.height + cur.length * value.offsetY,
    };
  });
  return {
    width: newSize.width,
    height: newSize.height,
    maxHeight: Math.max(acc.maxHeight, newSize.height),
    maxWidth: Math.max(acc.maxWidth, newSize.width),
    minHeight: Math.min(acc.minHeight, newSize.height),
    minWidth: Math.min(acc.minWidth, newSize.width),
  };
}, { width: 0, height: 0, maxHeight: 0, maxWidth: 0, minWidth: Infinity, minHeight: Infinity });

const mapPadding = 1;

const digSite = Array.from({ length: digSiteSize.maxHeight + Math.abs(digSiteSize.minHeight) + 1 + (mapPadding * 2) }, () => Array.from({ length: digSiteSize.maxWidth + Math.abs(digSiteSize.minWidth) + 1 + (mapPadding * 2) }, () => ' '));

const dig = ({ list, y, x }) => {
  const diggerPosition = {
    y: y + Math.abs(digSiteSize.minHeight) + mapPadding, x: x + Math.abs(digSiteSize.minWidth) + mapPadding,
  };
  list.forEach(({ dir, length }) => {
    for (let i = length; i > 0; i--) {
      digSite[diggerPosition.y + directions[dir].offsetY][diggerPosition.x + directions[dir].offsetX] = '#';
      diggerPosition.y += directions[dir].offsetY;
      diggerPosition.x += directions[dir].offsetX;
    }
  });
};

dig({ list: inputData, y: 0, x: 0 });

const fillStack = [];
const floodFill = (matrix, posY, posX, character) => {
  fillStack.push([posY, posX]);
  while (fillStack.length > 0) {
    const [posY, posX] = fillStack.pop();
    if (!matrix[posY]) continue;
    if (matrix[posY][posX] !== ' ') continue;
    matrix[posY][posX] = character;
    for (const direction in directions) {
      fillStack.push([posY + directions[direction].offsetY, posX + directions[direction].offsetX]);
    }
  }
};

const findFirstInsideTile = () => {
  let foundTile;
  mainLoop: for (let y = mapPadding; y < digSite.length; y++) {
    for (let x = mapPadding; x < digSite[0].length; x++) {
      if (digSite[y][x] === ' ') {
        foundTile = { y, x };
        break mainLoop;
      }
    }
  }
  return foundTile;
};

floodFill(digSite, 0, 0, ' ');
const insideTile = findFirstInsideTile();
floodFill(digSite, insideTile.y, insideTile.x, '#');

const generateVisualisation = (data) => data.map(line => line.join('')).join('\n');
fs.writeFileSync('visualization.txt', generateVisualisation(digSite), { flag: 'w+' });

const dugOutTiles = digSite.reduce((acc, row) => acc + row.filter(cell => cell === '#').length, 0);
console.log(`Part 1: ${dugOutTiles}`);
