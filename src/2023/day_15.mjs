import * as fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').replaceAll('\n', '').split(',');
const sum = (acc, cur) => (acc || 0) + cur;
const getHash = (string) => [...string].reduce((acc, cur) => ((acc + cur.charCodeAt(0)) * 17) % 256, 0);

console.log(`Part 1: ${inputData.map(getHash).reduce(sum)}`);

const boxes = Array.from({ length: 256 }, () => []);
inputData.forEach(step => {
  const [label, focalLength] = step.split(/[=-]/).filter(Boolean);
  const boxIndex = getHash(label);
  const lensIndex = boxes[boxIndex].findIndex(lens => lens[0] === label);
  if (focalLength !== undefined) {
    if (lensIndex < 0) boxes[boxIndex].push([label, focalLength]); else boxes[boxIndex][lensIndex][1] = focalLength;
    return;
  }
  if (lensIndex >= 0) boxes[boxIndex].splice(lensIndex, 1);
});

const focussingPower = boxes
  .map((box, boxIndex) => box.length ? box.map(([_, focalLength], lensIndex) => (boxIndex + 1) * (lensIndex + 1) * focalLength).reduce(sum) : undefined)
  .filter(Boolean)
  .reduce(sum);

console.log(`Part 2: ${focussingPower}`);
