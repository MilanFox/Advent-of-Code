import * as fs from 'node:fs';

class Trajectory {
  constructor(snapshot) {
    this.snapshot = snapshot;
    this.parse();
  }

  parse() {
    const [position, velocity] = this.snapshot.split(' @ ');
    const [px, py, pz] = position.split(', ').map(data => parseInt(data, 10));
    const [vx, vy, vz] = velocity.split(', ').map(data => parseInt(data, 10));

    this.position = { x: px, y: py, z: pz };
    this.velocity = { x: vx, y: vy, z: vz };

    const { x: x1, y: y1 } = this.position;
    const x2 = px + vx;
    const y2 = py + vy;

    this.m = (y2 - y1) / (x2 - x1);
    this.b = y1 - this.m * x1;
  }

  findIntersectionWith(otherTrajectory) {
    // https://www.cuemath.com/geometry/intersection-of-two-lines/
    const { b: b1, m: m1, position: p1, velocity: v1 } = this;
    const { b: b2, m: m2, position: p2, velocity: v2 } = otherTrajectory;

    let x = (b2 - b1) / (m1 - m2);
    let y = m1 * x + b1;

    const isInFuture = (x - p1.x) * v1.x > 0 && (y - p1.y) * v1.y > 0 && (x - p2.x) * v2.x > 0 && (y - p2.y) * v2.y > 0;

    return { isInFuture, point: { x, y } };
  }
}

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(snapshot => new Trajectory(snapshot));

const findCrossingsInBoundry = (min, max) => {
  let crossings = 0;
  const isInBounds = (axis, intersection) => intersection.point[axis] >= min && intersection.point[axis] <= max;

  inputData.forEach((trajectory, index) => {
    for (let i = index + 1; i < inputData.length; i++) {
      const intersection = trajectory.findIntersectionWith(inputData[i]);
      if (intersection.isInFuture && isInBounds('x', intersection) && isInBounds('y', intersection)) {
        crossings++;
      }
    }
  });

  return crossings;
};

console.log(`Part 1: ${findCrossingsInBoundry(200000000000000, 400000000000000)}`);

