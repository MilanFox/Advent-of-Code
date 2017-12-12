import * as fs from 'node:fs';

class Village {
  constructor(programs) {
    this.programs = {};
    programs.forEach(program => this.programs[program.id] = program);
    programs.forEach(program => program.pipes.forEach(pipe => {
      if (program.id !== pipe) {
        program.neighbors.push(this.programs[pipe]);
        this.programs[pipe].neighbors.push(program);
      }
    }));
  }
}

class Program {
  constructor(data) {
    const [id, connected] = data.split(' <-> ');
    this.id = id;
    this.pipes = connected.split(', ');
    this.neighbors = [];
  }
}

const village = new Village(fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new Program(data)));

const findConnectedPrograms = (startID) => {
  const visited = [];
  const queue = [startID];
  while (queue.length) {
    const currentProgram = village.programs[queue.shift()];
    if (visited.includes(currentProgram.id)) continue;
    visited.push(currentProgram.id);
    currentProgram.neighbors.forEach(neighbor => queue.push(neighbor.id));
  }
  return visited;
};

console.log(`Part 1: ${findConnectedPrograms(0).length}`);

const findNumberOfGroups = () => {
  const remainingIDs = new Set(Object.values(village.programs).map(program => program.id));
  let groups = 0;

  while (remainingIDs.size) {
    const groupMembers = findConnectedPrograms(remainingIDs.values().next().value);
    groups += 1;
    groupMembers.forEach(member => remainingIDs.delete(member));
  }

  return groups;
};

console.log(`Part 2: ${findNumberOfGroups()}`);
