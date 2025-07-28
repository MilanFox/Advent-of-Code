import { readFileSync } from 'node:fs';

class FloatingLight {
  constructor(data) {
    const parser = /position=<\s*(?<px>-?\d+),\s*(?<py>-?\d+)> velocity=<\s*(?<vx>-?\d+),\s*(?<vy>-?\d+)>/;
    const { px, py, vx, vy } = parser.exec(data).groups;
    this.px = Number(px);
    this.py = Number(py);
    this.vx = Number(vx);
    this.vy = Number(vy);
  }

  stepForward() {
    this.px += this.vx;
    this.py += this.vy;
  }

  stepBackwards() {
    this.px -= this.vx;
    this.py -= this.vy;
  }
}

const lights = readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new FloatingLight(data));

const findMessage = () => {
  let getProximityScore = (floatingLights) => {
    const bounds = floatingLights.reduce((acc, cur) => {
      acc.minX = Math.min(cur.px, acc.minX);
      acc.maxX = Math.max(cur.px, acc.maxX);
      acc.minY = Math.min(cur.py, acc.minY);
      acc.maxY = Math.max(cur.py, acc.maxY);
      return acc;
    }, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });

    return { ...bounds, score: bounds.maxX - bounds.minX + bounds.maxY - bounds.minY };
  };

  let prevProximityScore = Infinity;
  let i = 0;
  let bounds;

  while (true) {
    lights.forEach(light => light.stepForward());
    const { score: currentProximityScore } = getProximityScore(lights);
    if (currentProximityScore > prevProximityScore) {
      lights.forEach(light => light.stepBackwards());
      bounds = getProximityScore(lights);
      break;
    }
    prevProximityScore = currentProximityScore;
    i++;
  }

  const skyMap = Array.from({ length: bounds.maxY - bounds.minY + 1 }, () => Array.from({ length: bounds.maxX - bounds.minX + 1 }, () => ' '));

  lights.forEach(({ px, py }) => skyMap[py - bounds.minY][px - bounds.minX] = '█');

  return { text: skyMap.map(line => line.join('')).join('\n'), time: i };
};

const message = findMessage();

console.log(`Part 1:\n${message.text}`);
console.log(`Part 2:\n${message.time}`);
