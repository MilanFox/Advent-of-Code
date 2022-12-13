import * as fs from 'node:fs';

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n\n')
  .map(pair => pair.split('\n').map(packet => eval(packet)));

const localCompare = (left, right) => {
  if (left === right) return undefined;
  if (left === undefined) return true;
  if (right === undefined) return false;
  if (Number.isInteger(left) && Number.isInteger(right)) return left < right;
  if (Array.isArray(left) && Array.isArray(right)) return comparePair(left, right);
  return Number.isInteger(left) ? comparePair([left], right) : comparePair(left, [right]);
};

const comparePair = (left, right) => {
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const isCorrectOrder = localCompare(left[i], right[i]);
    if (isCorrectOrder !== undefined) return isCorrectOrder;
  }
};
const correctlyOrderedPairs = inputData
  .map((pair, i) => ({ index: i + 1, isCorrect: comparePair(...pair) }))
  .filter(pair => pair.isCorrect);

console.log(`Part 1: ${correctlyOrderedPairs.reduce((acc, cur) => acc + cur.index, 0)}`);

const dividerPacket1 = [[2]];
const dividerPacket2 = [[6]];
const allPackets = [...inputData.flat(), dividerPacket1, dividerPacket2];

allPackets.sort((a, b) => comparePair(a, b) ? -1 : 1);

const dividerPacketPos1 = allPackets.findIndex(packet => packet === dividerPacket1) + 1;
const dividerPacketPos2 = allPackets.findIndex(packet => packet === dividerPacket2) + 1;

console.log(`Part 2: ${dividerPacketPos1 * dividerPacketPos2}`);
