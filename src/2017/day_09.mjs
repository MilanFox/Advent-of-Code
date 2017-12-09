import * as fs from 'node:fs';

const streamData = fs.readFileSync('input.txt', 'utf-8').trim();

let garbageMode = false, totalScore = 0, depth = 1, garbageCount = 0;

for (let i = 0; i < streamData.length; i++) {
  const c = streamData[i];

  if (c === '!') {
    i++;
    continue;
  }

  if (garbageMode) {
    if (c === '>') garbageMode = false;
    else garbageCount++;
    continue;
  }

  switch (c) {
    case '<':
      garbageMode = true;
      break;
    case '{':
      totalScore += depth++;
      break;
    case '}':
      depth--;
      break;
  }
}

console.log(`Part 1: ${totalScore}`);
console.log(`Part 2: ${garbageCount}`);
