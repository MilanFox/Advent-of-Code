import * as fs from 'node:fs';

class SpaceObject {
  constructor(name) {
    this.name = name;
    this.children = [];
    this.parent = undefined;
  }

  get numberOfChildren() {
    return this.children.length + this.children.reduce((acc, child) => acc + child.numberOfChildren, 0);
  }
}

class Orbit {
  constructor(info) {
    this.objects = {};
    const distinctObjects = [...new Set(info.flat())].map(name => new SpaceObject(name));
    distinctObjects.forEach(object => this.objects[object.name] = object);

    orbitInfo.forEach(([a, b]) => {
      this.objects[a].children.push(this.objects[b]);
      this.objects[b].parent = this.objects[a];
    });
  }

  get allObjects() {
    return Object.values(this.objects);
  }

  get checksum() {
    return this.allObjects.reduce((acc, spaceObject) => acc + spaceObject.numberOfChildren, 0);
  };

  findShortestPath(source, target) {
    const queue = [[this.objects[source], 0]];
    const visited = [];

    while (queue.length) {
      const [currentNode, currentJumps] = queue.shift();
      visited.push(currentNode);
      if (currentNode === this.objects[target]) return currentJumps - 2;

      [currentNode.parent, ...currentNode.children].forEach(node => {
        if (node && !visited.includes(node)) queue.push([node, currentJumps + 1]);
      });
    }
  }
}

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n');
const orbitInfo = inputData.map(el => el.split(')'));
const orbit = new Orbit(orbitInfo);

console.log(`Part 1: ${orbit.checksum}`);

console.log(orbit.findShortestPath('YOU', 'SAN'));

