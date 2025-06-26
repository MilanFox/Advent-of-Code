import { readFileSync } from 'node:fs';

class Jupiter {
  constructor(moonData) {
    this.moons = moonData.map(data => new Moon(data));
  }

  simulateTimeStep() {
    for (let a = 0; a < this.moons.length; a++) {
      for (let b = a + 1; b < this.moons.length; b++) {
        this.moons[a].applyGravity(this.moons[b]);
        this.moons[b].applyGravity(this.moons[a]);
      }
    }

    this.moons.forEach(moon => moon.applyVelocity());
  }

  get totalEnergy() {
    return this.moons.reduce((acc, cur) => acc + cur.totalEnergy, 0);
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

for (let i = 0; i < 1000; i++) {
  jupiter.simulateTimeStep();
}

console.log(`Part 1: ${jupiter.totalEnergy}`);
