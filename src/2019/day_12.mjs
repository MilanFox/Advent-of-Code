import { readFileSync } from 'node:fs';

class Jupiter {
  constructor(moonData) {
    this.moons = moonData.map(data => new Moon(data));
    this.states = { x: new Set, y: new Set, z: new Set };
    this.loopPoints = { x: undefined, y: undefined, z: undefined };
  }

  simulateTimeStep() {
    for (let a = 0; a < this.moons.length; a++) {
      for (let b = a + 1; b < this.moons.length; b++) {
        this.moons[a].applyGravity(this.moons[b]);
        this.moons[b].applyGravity(this.moons[a]);
      }
    }

    this.moons.forEach(moon => moon.applyVelocity());
    this.logState();
    return this.loopPoints;
  }

  get totalEnergy() {
    return this.moons.reduce((acc, cur) => acc + cur.totalEnergy, 0);
  }

  logState() {
    ['x', 'y', 'z'].forEach(axis => {
      if (this.loopPoints[axis]) return;
      const hash = this.moons.map(moon => `(${moon.position[axis]}|${moon.velocity[axis]})`).join('-');

      if (this.states[axis].has(hash)) this.loopPoints[axis] = this.states[axis].size;
      else this.states[axis].add(hash);
    });
  }

  get loopPoint() {
    const getLCM = (arr) => {
      const getGreatestCommonDivisor = (x, y) => (!y ? x : getGreatestCommonDivisor(y, x % y));
      const getLeastCommonMultiple = (x, y) => (x * y) / getGreatestCommonDivisor(x, y);
      return [...arr].reduce((a, b) => getLeastCommonMultiple(a, b));
    };

    return getLCM(Object.values(this.loopPoints));
  }
}

class Moon {
  constructor(data) {
    this.velocity = { x: 0, y: 0, z: 0 };
    this.position = {};
    [this.position.x, this.position.y, this.position.z] = data.match(/-?\d+/g).map(Number);
  }

  applyGravity(partnerMoon) {
    ['x', 'y', 'z'].forEach(axis => {
      this.velocity[axis] += Math.sign(partnerMoon.position[axis] - this.position[axis]);
    });
  }

  applyVelocity() {
    ['x', 'y', 'z'].forEach(axis => {
      this.position[axis] += this.velocity[axis];
    });
  }

  get totalEnergy() {
    const potentialEnergy = ['x', 'y', 'z'].reduce((acc, axis) => acc + Math.abs(this.position[axis]), 0);
    const kineticEnergy = ['x', 'y', 'z'].reduce((acc, axis) => acc + Math.abs(this.velocity[axis]), 0);
    return potentialEnergy * kineticEnergy;
  }
}

const inputData = readFileSync('input.txt', 'utf-8').trim().split('\n');

const jupiter = new Jupiter(inputData);

let i = 0;

while (true) {
  i++;
  const loops = jupiter.simulateTimeStep();
  if (i === 1000) console.log(`Part 1: ${jupiter.totalEnergy}`);
  if (loops.x && loops.y && loops.z) break;
}

console.log(`Part 2: ${jupiter.loopPoint}`);
