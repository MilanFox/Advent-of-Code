import { readFileSync } from 'node:fs';

const compressedData = readFileSync('input.txt', 'utf-8').trim();

const getDecompressedSize = (sequence, { version } = { version: 1 }) => {
  let decompressedDataSize = 0;

  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i] !== '(') decompressedDataSize += 1;

    else {
      const remainingString = sequence.substring(i, sequence.length);
      const [match, length, repeatCount] = remainingString.match(/^\D*\((\d+)x(\d+)\)/);
      let repeatStringSize = remainingString.substring(match.length, match.length + Number(length)).length;
      if (version === 2) repeatStringSize = getDecompressedSize(remainingString.substring(match.length, match.length + Number(length)), { version });
      for (let i = 0; i < repeatCount; i++) decompressedDataSize += repeatStringSize;
      i += match.length + Number(length) - 1;
    }

  }

  return decompressedDataSize;
};

console.log(`Part 1: ${getDecompressedSize(compressedData)}`);
console.log(`Part 2: ${getDecompressedSize(compressedData, { version: 2 })}`);
