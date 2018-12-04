import * as fs from 'node:fs';

class SleepPeriod {
  constructor(entryA, entryB) {
    this.asleepAt = entryA;
    this.wakesUpAt = entryB;
  }
}

class Guard {
  constructor(id) {
    this.id = parseInt(id.substring(1));
    this.sleepingPhases = [];
    this.timetable = Array.from({ length: 60 }, () => 0);
  }

  addSleepingRecord(record) {
    this.sleepingPhases.push(record);
    for (let i = record.asleepAt.time.getUTCMinutes(); i < record.wakesUpAt.time.getUTCMinutes(); i++) {
      this.timetable[i] += 1;
    }
  }

  get totalMinutesAsleep() {
    return this.sleepingPhases.reduce((acc, cur) => acc + (((cur.wakesUpAt.time - cur.asleepAt.time) / 60) / 1000), 0);
  }

  get mostSleepyMinute() {
    return this.timetable.indexOf(Math.max(...this.timetable));
  }

  get maxSleepinessFactor() {
    return this.timetable[this.mostSleepyMinute];
  }
}

class LogEntry {
  constructor(data) {
    const [timeData, activityData] = data.split('] ');
    this.time = new Date(timeData.substring(1) + 'Z');
    this.entry = activityData;
  }
}

const log = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(log => new LogEntry(log)).toSorted((a, b) => a.time - b.time);
const guards = {};

const matchRecordsToGuards = () => {
  let currentGuard = undefined;
  let pointer = 0;

  while (pointer < log.length) {
    if (log[pointer].entry.startsWith('Guard')) {
      currentGuard = log[pointer].entry.split(' ')[1];
      pointer += 1;
      continue;
    }

    if (!guards[currentGuard]) guards[currentGuard] = new Guard(currentGuard);

    guards[currentGuard].addSleepingRecord(new SleepPeriod(log[pointer], log[pointer + 1]));
    pointer += 2;
  }
};

matchRecordsToGuards();

const sleepiestGuard = Object.values(guards).toSorted((a, b) => b.totalMinutesAsleep - a.totalMinutesAsleep).at(0);
console.log(`Part 1: ${sleepiestGuard.id * sleepiestGuard.mostSleepyMinute}`);

const mostReliablySleepingGuard = Object.values(guards).toSorted((a, b) => b.maxSleepinessFactor - a.maxSleepinessFactor).at(0);
console.log(`Part 2: ${mostReliablySleepingGuard.id * mostReliablySleepingGuard.mostSleepyMinute}`);
