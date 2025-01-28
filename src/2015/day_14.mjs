import fs from 'node:fs';

const parser = /(?<name>\b[A-Z][a-z]+\b) can fly (?<speed>\d+) km\/s for (?<duration>\d+) seconds, but then must rest for (?<restingPeriod>\d+) seconds\./;

const reindeer = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => parser.exec(data).groups);

const getDistance = ({ speed, duration, restingPeriod }, time) => {
  const cycleLength = Number(duration) + Number(restingPeriod);
  const cycleDistance = Number(speed) * Number(duration);
  const finishedCycles = Math.floor(time / cycleLength);
  const timeLeft = time % cycleLength;
  return (finishedCycles * cycleDistance) + (Math.min(duration, timeLeft) * Number(speed));
};

const getWinningDistance = (time) => Math.max(...reindeer.map(r => getDistance(r, time)));

console.log(`Part 1: ${getWinningDistance(2503)}`);
