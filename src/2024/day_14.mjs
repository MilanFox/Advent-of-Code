import fs from 'node:fs';

class SecurityRobot {
  constructor(data) {
    [this.px, this.py, this.vx, this.vy] = data.match(/-?\d+/g).map(Number);
  }

  getPosition({ steps, width, height }) {
    const x = (((this.px + (steps * this.vx) % width) + width) % width);
    const y = (((this.py + (steps * this.vy) % height) + height) % height);
    return { x, y };
  }
}

class Floor {
  constructor({ width, height, robots }) {
    this.width = width;
    this.height = height;
    this.robots = robots;
  }

  getSafetyFactor({ seconds }) {
    const robots = this.robots.map(robot => robot.getPosition({
      steps: seconds,
      height: this.height,
      width: this.width,
    }));

    const isLeft = (robot) => robot.x < Math.floor(this.width / 2);
    const isRight = (robot) => robot.x > Math.floor(this.width / 2);
    const isUp = (robot) => robot.y < Math.floor(this.height / 2);
    const isDown = (robot) => robot.y > Math.floor(this.height / 2);

    const q1 = robots.filter(robot => isLeft(robot) && isUp(robot));
    const q2 = robots.filter(robot => isRight(robot) && isUp(robot));
    const q3 = robots.filter(robot => isLeft(robot) && isDown(robot));
    const q4 = robots.filter(robot => isRight(robot) && isDown(robot));

    return q1.length * q2.length * q3.length * q4.length;
  };
}

const robots = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new SecurityRobot(data));

const floor = new Floor({ width: 101, height: 103, robots });

console.log(`Part 1: ${floor.getSafetyFactor({ seconds: 100 })}`);
console.log(`Part 2: Check HTML file`);

