import { readFileSync } from 'node:fs';
import fs from 'fs';

const entity = {
  GOBLIN: Symbol('goblin'),
  ELF: Symbol('elf'),
};

const tile = {
  VOID: ' ',
  WALL: '█',
  [entity.GOBLIN]: 'G',
  [entity.ELF]: 'E',
};

class Entity {
  constructor({ x, y, cave, type, enemy }) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.health = 200;
    this.attackPower = 3;
    this.enemy = enemy;
    this.cave = cave;
  }

  get targetTile() {
    const dirs = [[0, -1], [-1, 0], [1, 0], [0, 1]];

    const seen = new Set();
    const queue = [{ x: this.x, y: this.y, distance: 0 }];
    const closestTargets = [];

    while (queue.length) {
      const { x, y, distance } = queue.shift();

      const positionHash = `${x}|${y}`;
      if (seen.has(positionHash)) continue;
      seen.add(positionHash);

      const isWall = this.cave.map[y][x] === tile.WALL;
      const isTooFar = closestTargets.length && distance > closestTargets[0].distance;
      const isEntity = (x !== this.x || y !== this.y) && this.cave.positionLookup.get(`${x}|${y}`);
      if (isWall || isTooFar || isEntity) continue;

      const adjacentEnemyPosition = dirs.find(([dx, dy]) => this.cave.positionLookup.get(`${x + dx}|${y + dy}`)?.type === this.enemy);

      if (adjacentEnemyPosition) {
        closestTargets.push({ x, y, distance });
        continue;
      }

      dirs.forEach(([dx, dy]) => queue.push({ x: x + dx, y: y + dy, distance: distance + 1 }));
    }

    if (!closestTargets.length) return null;
    return closestTargets.sort((a, b) => a.y - b.y || a.x - b.x).at(0);
  };

  getNextStep(target) {
    const dirs = [[0, -1], [-1, 0], [1, 0], [0, 1]];

    const queue = [{ x: this.x, y: this.y, path: [] }];
    const seen = new Set();
    let bestPath = null;

    while (queue.length) {
      const { x, y, path } = queue.shift();

      const positionHash = `${x}|${y}`;
      if (seen.has(positionHash)) continue;
      seen.add(positionHash);

      if (x === target.x && y === target.y) {
        bestPath = [...path, [x, y]];
        break;
      }

      const isWall = this.cave.map[y][x] === tile.WALL;
      const isEntity = this.cave.positionLookup.get(positionHash);
      if (isWall || isEntity) continue;

      dirs.forEach(([dx, dy]) => queue.push({ x: x + dx, y: y + dy, path: [...path, [x, y]] }));
    }

    return bestPath.at(1);
  }

  moveTo(target) {
    this.cave.positionLookup.delete(`${this.x}|${this.y}`);
    const [x, y] = this.getNextStep(target);
    this.x = x;
    this.y = y;
    this.cave.positionLookup.set(`${this.x}|${this.y}`, this);
  }

  tryAttack() {
    const dirs = [[0, -1], [-1, 0], [1, 0], [0, 1]];

    const enemiesInReach = dirs.reduce((acc, [dx, dy]) => {
      const entity = this.cave.positionLookup.get(`${this.x + dx}|${this.y + dy}`);
      if (entity?.type === this.enemy) acc.push(entity);
      return acc;
    }, []);

    if (!enemiesInReach.length) return;

    const target = enemiesInReach.sort((a, b) => a.health - b.health || a.y - b.y || a.x - b.x).at(0);
    target.takeDamage(this.attackPower);
  }

  takeTurn() {
    const targetTile = this.targetTile;
    if (targetTile === null) return;

    if (targetTile.distance > 0) this.moveTo(targetTile);
    this.tryAttack();
  }

  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.cave.positionLookup.delete(`${this.x}|${this.y}`);
      this.cave.entities[this.cave.entities.findIndex(entity => entity === this)] = undefined;
    }
  }
}

class Cave {
  map;
  entities = [];
  positionLookup = new Map();

  constructor(input) {
    this.map = input.trim().split('\n').map(line => line.split(''));

    this.map.forEach((line, y) => line.forEach((cell, x) => {
      if (cell === 'G') this.entities.push(new Entity({ x, y, cave: this, type: entity.GOBLIN, enemy: entity.ELF }));
      if (cell === 'E') this.entities.push(new Entity({ x, y, cave: this, type: entity.ELF, enemy: entity.GOBLIN }));
      if (cell !== '#') this.map[y][x] = tile.VOID;
      else this.map[y][x] = tile.WALL;
    }));

    this.entities.forEach((entity) => this.positionLookup.set(`${entity.x}|${entity.y}`, entity));
  }

  sortEntities() {
    this.entities = this.entities.filter(Boolean);
    this.entities.sort((a, b) => a.y - b.y || a.x - b.x);
  }

  draw(n) {
    const topView = this.map.map((line, y) => line.map((cell, x) => {
      const entity = this.positionLookup.get(`${x}|${y}`);
      if (entity) return tile[entity.type];
      return cell;
    }).join('')).join('\n');

    fs.writeFileSync(`visualization.txt_${n}`, topView, { flag: 'w+' });
  }

  simulateRound() {
    this.sortEntities();
    for (const entity of this.entities) {
      if (!entity) continue;
      const areEnemiesLeft = this.entities.some(e => e && e.type !== entity.type);
      if (!areEnemiesLeft) return false;

      entity.takeTurn();
    }
    return true;
  }

  simulate() {
    let i = 0;

    while (true) {
      i += 1;
      const completed = this.simulateRound();
      if (!completed) break;
      if (this.entities.every(entity => entity?.type === this.entities[0]?.type)) break;
    }

    return (i - 1) * this.entities.reduce((acc, entity) => acc + (entity?.health || 0), 0);
  }
}

const cave = new Cave(readFileSync('input.txt', 'utf-8'));

const checksum = cave.simulate();
console.log(`Part 1: ${checksum}`);
