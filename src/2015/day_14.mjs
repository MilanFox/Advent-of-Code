import fs from 'node:fs';

class Reindeer {
  constructor({ name, speed, duration, restingPeriod }) {
    this.name = name;
    [this.speed, this.duration, this.restingPeriod] = [speed, duration, restingPeriod].map(Number);
    this.cycleLength = this.duration + this.restingPeriod;
    this.cycleDistance = this.speed * this.duration;
  }

  getDistanceAt(time) {
    const finishedCycles = Math.floor(time / this.cycleLength);
    const timeLeft = time % this.cycleLength;
    return (finishedCycles * this.cycleDistance) + (Math.min(this.duration, timeLeft) * this.speed);
  }
}

const parser = /(?<name>\b[A-Z][a-z]+\b) can fly (?<speed>\d+) km\/s for (?<duration>\d+) seconds, but then must rest for (?<restingPeriod>\d+) seconds\./;

const reindeer = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new Reindeer(parser.exec(data).groups));

const getWinningDistance = (time) => Math.max(...reindeer.map(r => r.getDistanceAt(time)));

console.log(`Part 1: ${getWinningDistance(2503)}`);

const getWinningScore = (time) => {
  const score = reindeer.reduce((acc, cur) => ({ ...acc, [cur.name]: 0 }), {});
  for (let i = 1; i <= time; i++) {
    const distance = reindeer.map(r => [r.getDistanceAt(i), r.name]).sort(([a], [b]) => b - a);
    let p = 0;
    while (p < distance.length && (p === 0 || distance[p][0] === distance[p - 1][0])) {
      score[distance[p][1]] += 1;
      p += 1;
    }
  }
  return Math.max(...Object.values(score));
};

console.log(`Part 2: ${getWinningScore(2503)}`);
