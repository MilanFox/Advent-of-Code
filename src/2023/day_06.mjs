import * as fs from 'node:fs';

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(line => line.split(' ').map(n => parseInt(n)).filter((n) => !isNaN(n)));

const getAllTimes = ([distance]) => distance
  .map((totalDistance) => Array.from({ length: totalDistance + 1 }, (_, i) => i * (totalDistance - i)));

const getTimesOnRecordPace = ([distance, recordTime]) => getAllTimes([distance, recordTime])
  .map((achievedTimes, index) => achievedTimes.filter(time => time > recordTime[index]).length);

console.log(`Part 1: ${getTimesOnRecordPace(inputData).reduce((acc, cur) => acc * cur, 1)}`);

const newData = inputData.map(entry => [parseInt(entry.reduce((acc, cur) => acc + cur, ''))]);

console.log(`Part 2: ${getTimesOnRecordPace(newData)}`);
