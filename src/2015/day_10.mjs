import fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').trim();

const lookAndSay = (str) => str.match(/(.)\1*/g).flatMap(chunk => [chunk.length, chunk[0]]).join('');

const play = (n) => {
  let str = inputData;
  for (let i = 0; i < n; i++) str = lookAndSay(str);
  return str;
};

console.log(`Part 1: ${play(40).length}`);
console.log(`Part 2: ${play(50).length}`);

