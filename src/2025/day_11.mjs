import { readFileSync } from 'node:fs';

class Network {
  constructor(connections) {
    this.devices = new Map();
    connections.forEach(([name, neighbours]) => {
      this.tryAdd(name);
      neighbours.split(' ').forEach(neighbour => {
        this.tryAdd(neighbour);
        this.devices.get(name).addNeighbour(this.devices.get(neighbour));
      });
    });

    this.you = this.devices.get('you');
    this.out = this.devices.get('out');
  }

  tryAdd(name) {
    if (!this.devices.get(name)) this.devices.set(name, new Device(name));
  }
}

class Device {
  constructor(name) {
    this.name = name;
    this.neighbours = [];
  }

  #pathsToOutNode = undefined;

  addNeighbour(device) {
    this.neighbours.push(device);
  }

  get pathsToOutNode() {
    if (this.name === 'out') return 1;
    if (this.#pathsToOutNode === undefined) this.#pathsToOutNode = this.neighbours.reduce((acc, neighbour) => acc + neighbour.pathsToOutNode, 0);
    return this.#pathsToOutNode;
  }
}

const network = new Network(readFileSync('input.txt', 'utf-8').trim().split('\n').map(line => line.split(': ')));

console.log(`Part 1: ${network.you.pathsToOutNode}`);
