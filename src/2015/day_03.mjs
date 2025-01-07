import fs from 'node:fs';

const directions = {
  '^': { dx: 0, dy: -1 },
  '>': { dx: 1, dy: 0 },
  'v': { dx: 0, dy: 1 },
  '<': { dx: -1, dy: 0 },
};

class Route {
  constructor(route) {
    this.route = route;
  }

  run() {
    const currentPos = { x: 0, y: 0 };
    const visited = new Set([`0|0`]);

    while (this.route.length) {
      const { dx, dy } = directions[this.route.shift()];
      currentPos.x += dx;
      currentPos.y += dy;
      visited.add(`${currentPos.x}|${currentPos.y}`);
    }

    return visited;
  }
}

const instructions = fs.readFileSync('input.txt', 'utf-8').trim().split('');

const singleRoute = new Route([...instructions]);

console.log(`Part 1: ${singleRoute.run().size}`);

const splitRoute = [
  new Route(instructions.filter((_, i) => i % 2 === 0)),
  new Route(instructions.filter((_, i) => i % 2 !== 0)),
];

console.log(`Part 2: ${new Set(splitRoute.flatMap(route => [...(route.run())])).size}`);
