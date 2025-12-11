import { readFileSync } from 'node:fs';

class Network {
  constructor(connections) {
    connections.forEach(([name, neighbours]) => {
      this.tryAdd(name);
      neighbours.split(' ').forEach(neighbour => {
        this.tryAdd(neighbour);
        this.devices.get(name).addNeighbour(this.devices.get(neighbour));
      });
    });
  }

  devices = new Map();

  tryAdd(name) {
    if (!this.devices.get(name)) this.devices.set(name, new Device(name));
  }

  numberOfPaths(node1, node2) {
    return this.devices.get(node1).computePathsTo(node2);
  }
}

class Device {
  constructor(name) {
    this.name = name;
  }

  #memo = new Map();
  #neighbours = [];

  addNeighbour(device) {
    this.#neighbours.push(device);
  }

  computePathsTo = (target) => {
    if (this.name === target) return 1;
    if (this.#memo.has(target)) return this.#memo.get(target);
    const count = this.#neighbours.reduce((acc, neighbour) => acc + neighbour.computePathsTo(target), 0);
    this.#memo.set(target, count);
    return count;
  };
}

const network = new Network(readFileSync('input.txt', 'utf-8').trim().split('\n').map(line => line.split(': ')));

console.log(`Part 1: ${network.numberOfPaths('you', 'out')}`);
console.log(`Part 2: ${network.numberOfPaths('svr', 'fft') * network.numberOfPaths('fft', 'dac') * network.numberOfPaths('dac', 'out')}`);
