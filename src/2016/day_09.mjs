import { readFileSync } from 'node:fs';

const compressedData = readFileSync('input.txt', 'utf-8').trim();

let decompressedData = '';

for (let i = 0; i < compressedData.length; i++) {
  if (compressedData[i] !== '(') decompressedData += compressedData[i];
  else {
    const remainingString = compressedData.substring(i, compressedData.length - 1);
    const [match, length, repeatCount] = remainingString.match(/^\D*\((\d+)x(\d+)\)/);
    const repeatString = compressedData.substring(i + match.length, i + match.length + Number(length));
    decompressedData += repeatString.repeat(Number(repeatCount));
    i += match.length + Number(length) - 1;
  }
}

console.log(`Part 1: ${decompressedData.length}`);
