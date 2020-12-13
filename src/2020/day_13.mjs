import * as fs from 'node:fs';

const [departureTime, busData] = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => data);
const timestamp = parseInt(departureTime);

class Bus {
  constructor(line) {
    this.line = parseInt(line);
  }

  get earliestDeparture() {
    return timestamp + (this.line - (timestamp % this.line));
  }
}

const busses = busData.split(',').filter(el => el !== 'x').map(data => new Bus(data));

const departures = busses.sort((a, b) => a.earliestDeparture - b.earliestDeparture);
const earliestBus = departures[0];

console.log(`Part 1: ${(earliestBus.earliestDeparture - timestamp) * earliestBus.line}`);
