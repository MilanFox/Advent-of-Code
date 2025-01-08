import fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').trim();

const checksum = inputData.match(/-?\d+/g).map(Number).reduce((acc, cur) => acc + cur, 0);
console.log(`Part 1: ${checksum}`);

const countNonRed = (data) => {
  if (typeof data === 'number') return data;
  if (typeof data === 'string') return 0;
  if (Array.isArray(data)) return data.map(countNonRed).reduce((acc, cur) => acc + cur, 0);
  if (Object.values(data).includes('red')) return 0;
  return countNonRed(Object.values(data));
};

const jsonData = JSON.parse(inputData);
console.log(`Part 2: ${countNonRed(jsonData)}`);

