import fs from 'node:fs';

const diskMap = fs.readFileSync('input.txt', 'utf-8').trim().split('');

const fragmentByChunk = () => {
  const fileBlocks = diskMap.filter((_, i) => i % 2 === 0).map(Number);
  const freeSpaceBlocks = diskMap.filter((_, i) => i % 2 !== 0).map(Number);
  const fragments = fileBlocks.flatMap((length, id) => Array(length).fill(id));
  const fragmentationMap = [];

  while (fileBlocks.length) {
    const fileBlockLength = fileBlocks.shift();
    const freeSpaceLength = freeSpaceBlocks.shift();

    for (let i = 0; i < fileBlockLength; i++) {
      const fragment = fragments.shift();
      if (fragment === undefined) break;
      fragmentationMap.push(fragment);
    }

    for (let i = 0; i < freeSpaceLength; i++) {
      const fragment = fragments.pop();
      if (fragment === undefined) break;
      fragmentationMap.push(fragment);
    }
  }
  return fragmentationMap;
};

const checksum = (fragmentationMap) => fragmentationMap.reduce((acc, cur, i) => acc + (cur * i), 0);

console.log(`Part 1: ${checksum(fragmentByChunk())}`);
