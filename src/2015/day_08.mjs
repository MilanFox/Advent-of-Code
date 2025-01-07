import fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => data);

const decodedLength = (string) => string
  .slice(1, -1)
  .replace(/\\x[0-9a-fA-F]{2}/g, 'x')
  .replace(/\\"/g, '"')
  .replace(/\\\\/g, '\\')
  .length;

const decodeChecksum = inputData.reduce((acc, cur) => acc + (cur.length - decodedLength(cur)), 0);
console.log(`Part 1: ${decodeChecksum}`);

const encodedLength = (string) => 2 + string
  .replace(/\\/g, '\\\\')
  .replace(/"/g, '\\"')
  .replace(/([^\x00-\x7F])/g, '\\x$1')
  .length;

const encodeChecksum = inputData.reduce((acc, cur) => acc + (encodedLength(cur) - cur.length), 0);
console.log(`Part 2: ${encodeChecksum}`);
