import * as fs from 'node:fs';

class Asteroid {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
  }

  neighbors = {};

  get laserAngles() {
    return Object.keys(this.neighbors).toSorted((a, b) => Number(a) - Number(b));
  }

  get visibleAsteroids() {
    return Object.keys(this.neighbors).length;
  }

  distanceTo(otherAsteroid) {
    const dx = otherAsteroid.x - this.x;
    const dy = otherAsteroid.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  sortNeighborsByDistance() {
    for (const angle in this.neighbors) {
      this.neighbors[angle].sort((a, b) => this.distanceTo(a) - this.distanceTo(b));
    }
  }
}

const starMap = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => data.split(''));

const findAsteroids = (grid) => {
  const asteroids = [];
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === '#') asteroids.push(new Asteroid({ x, y }));
    });
  });
  return asteroids;
};

const asteroids = findAsteroids(starMap);

const findAngle = (asteroidA, asteroidB) => {
  const dx = asteroidB.x - asteroidA.x;
  const dy = asteroidB.y - asteroidA.y;
  const angleInDegrees = (Math.atan2(dy, dx) * 180) / Math.PI;
  const normalizedAngle = (angleInDegrees + 360) % 360;
  return (normalizedAngle + 90) % 360; /* Rotate 90°, so that 0° points right above for part 2*/
};

const findAllAngles = (asteroids) => {
  let i = 0;
  while (i < asteroids.length) {
    for (let j = 0; j < asteroids.length; j++) {
      if (i === j) continue;
      const angle = findAngle(asteroids[i], asteroids[j]);
      (asteroids[i].neighbors[angle] ??= []).push(asteroids[j]);
    }
    i++;
  }
};

findAllAngles(asteroids);

const laserLocation = asteroids.toSorted((a, b) => b.visibleAsteroids - a.visibleAsteroids)[0];

console.log(`Part 1: ${laserLocation.visibleAsteroids}`);

laserLocation.sortNeighborsByDistance();

const fireLaser = (n) => {
  const angles = [...laserLocation.laserAngles];
  let i = 0;
  while (true) {
    if (laserLocation.neighbors[angles[i]].length) {
      n--;
      const destroyedAsteroid = laserLocation.neighbors[angles[i]].shift();
      if (n <= 0) return destroyedAsteroid;
      i++;
    } else {
      i++;
    }
  }
};

const nthTargetAsteroid = fireLaser(200);
console.log(`Part 2: ${(nthTargetAsteroid.x * 100) + nthTargetAsteroid.y}`);
