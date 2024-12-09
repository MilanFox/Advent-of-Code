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

class File {
  constructor(length, i) {
    this.type = 'file';
    this.length = Number(length);
    this.id = i / 2;
  }
}

class Space {
  constructor(length) {
    this.type = 'space';
    this.length = Number(length);
  }
}

const fragmentByFile = () => {
  const fileSystem = diskMap.map((length, i) => {
    if (i % 2 === 0) return new File(length, i);
    else return new Space(length);
  });

  const files = fileSystem.filter(el => el.type === 'file').toReversed();

  for (const file of files) {
    const i = fileSystem.findIndex(el => el.type === 'space' && el.length >= file.length);
    if ((i === -1)) continue;
    fileSystem.splice(i, 0, file);
    fileSystem[i + 1].length -= file.length;
    const lastIndex = fileSystem.findLastIndex(el => el === file);

    if (fileSystem[lastIndex - 1].type === 'space') {
      if (fileSystem[lastIndex + 1]?.type === 'space') {
        fileSystem[lastIndex + 1].length += fileSystem[lastIndex - 1].length + file.length;
        fileSystem.splice(lastIndex - 1, 2);
        continue;
      }
      fileSystem[lastIndex - 1].length += file.length;
      fileSystem.splice(lastIndex, 1);
      continue;
    }

    if (fileSystem[lastIndex + 1]?.type === 'space') {
      fileSystem[lastIndex + 1].length += file.length;
      fileSystem.splice(lastIndex, 1);
      continue;
    }

    fileSystem.splice(lastIndex, 1, new Space(file.length));

  }

  return fileSystem.flatMap(el => Array(el.length).fill(el.id ?? 0));
};

console.log(`Part 2: ${checksum(fragmentByFile())}`);
