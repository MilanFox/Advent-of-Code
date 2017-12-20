import * as fs from 'node:fs';

function* simulator(particle) {
  while (true) {
    particle.v = particle.v.map((v, i) => v + particle.a[i]);
    particle.p = particle.p.map((p, i) => p + particle.v[i]);
    yield;
  }
}

class Particle {
  constructor(data, id) {
    this.id = id;
    this.simulator = simulator(this);
    this.#originalData = data;
    this.parse(data);
  }

  #originalData;

  parse(data) {
    const [p, v, a] = data.split(', ');
    const getNumbers = (declaration) => declaration.match(/-?\d+/g).map(n => parseInt(n));
    this.p = getNumbers(p);
    this.v = getNumbers(v);
    this.a = getNumbers(a);
  }

  reset() {
    this.parse(this.#originalData);
  }

  get manhattanDistance() {
    return this.p.reduce((acc, cur) => acc + Math.abs(cur), 0);
  }

  get positionHash() {
    return this.p.join('-');
  }
}

const particles = new Set(fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map((data, i) => new Particle(data, i)));

function findCollisions(particles) {
  const positionMap = [...particles].reduce((acc, cur) => {
    (acc[cur.positionHash] ??= []).push(cur);
    return acc;
  }, {});
  return Object.values(positionMap).filter(entry => entry.length > 1).flat();
}

const simulateRounds = (n, { isCollisionActive } = {}) => {
  for (let i = 0; i < n; i++) {
    particles.forEach(particle => particle.simulator.next());
    if (isCollisionActive) {
      const collisions = findCollisions(particles);
      collisions.forEach(particle => particles.delete(particle));
    }
  }
};

/* Can't come up with something clever, so I am brute forcing it by simulating enough rounds...
   Still takes below 1s to calculate, so meh... Good enough. */

const simulatedRounds = 1000;

simulateRounds(simulatedRounds);
const sortedParticles = [...particles].sort((a, b) => a.manhattanDistance - b.manhattanDistance);
console.log(`Part 1: ${sortedParticles.at(0).id}`);

particles.forEach(particle => particle.reset());
simulateRounds(simulatedRounds, { isCollisionActive: true });
console.log(`Part 2: ${particles.size}`);
