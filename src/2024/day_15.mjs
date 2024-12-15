import fs from 'node:fs';

class Warehouse {
  constructor(map) {
    map.split('\n').forEach((row, y) => {
      row.split('').forEach((cell, x) => {
        switch (cell) {
          case '#':
            this.walls.push(new Wall({ x, y }, this));
            break;
          case 'O':
            this.boxes.push(new Box({ x, y }, this));
            break;
          case '@':
            this.robot = new Robot({ x, y }, instructionData, this);
        }
      });
    });
  }

  boxes = [];
  walls = [];
  robot;

  wallAt({ x, y }) {
    return this.walls.find(wall => wall.x === x && wall.y === y);
  }

  boxAt({ x, y }) {
    return this.boxes.find(wall => wall.x === x && wall.y === y);
  }
}

class Box {
  constructor({ x, y }, warehouse) {
    this.type = 'box';
    this.x = x;
    this.y = y;
    this.#warehouse = warehouse;
  }

  #warehouse;

  get gpsCoordinate() {
    return 100 * this.y + this.x;
  }

  push([dx, dy]) {
    const x = this.x + dx;
    const y = this.y + dy;
    if (this.#warehouse.wallAt({ x, y })) return false;

    const maybeBox = this.#warehouse.boxAt({ x, y });
    if (maybeBox) {
      const canBePushed = maybeBox.push([dx, dy]);
      if (!canBePushed) return false;
    }

    this.x += dx;
    this.y += dy;
    return true;
  }
}

class Wall {
  constructor({ x, y }, warehouse) {
    this.type = 'wall';
    this.x = x;
    this.y = y;
    this.#warehouse = warehouse;
  }

  #warehouse;
}

class Robot {
  constructor({ x, y }, instructionData, warehouse) {
    this.type = 'robot';
    this.x = x;
    this.y = y;
    this.instructions = instructionData.replaceAll('\n', '').split('').map(instr => {
      switch (instr) {
        case '<':
          return [-1, 0];
        case '>':
          return [1, 0];
        case '^':
          return [0, -1];
        case 'v':
          return [0, 1];
      }
    });

    this.#warehouse = warehouse;
  }

  #warehouse;

  run() {
    this.instructions.forEach(([dx, dy]) => {
      const x = this.x + dx;
      const y = this.y + dy;
      if (this.#warehouse.wallAt({ x, y })) return;

      const maybeBox = this.#warehouse.boxAt({ x, y });
      if (maybeBox) {
        const canBePushed = maybeBox.push([dx, dy]);
        if (!canBePushed) return;
      }

      this.x += dx;
      this.y += dy;
    });
  }
}

const [warehouseData, instructionData] = fs.readFileSync('input.txt', 'utf-8').trim().split('\n\n');
const warehouse = new Warehouse(warehouseData);

warehouse.robot.run();

const gpsChecksum = warehouse.boxes.reduce((acc, cur) => acc + cur.gpsCoordinate, 0);
console.log(`Part 1: ${gpsChecksum}`);
