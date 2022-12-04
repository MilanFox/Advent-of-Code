import * as fs from 'node:fs';

class Assignment {
  constructor(data) {
    this.assignment = data.split(',').map(elf => elf.split('-').map(Number));
  }

  get hasFullOverlap() {
    const [elf1, elf2] = this.assignment;
    return (elf1[0] >= elf2[0] && elf1[1] <= elf2[1]) || (elf2[0] >= elf1[0] && elf2[1] <= elf1[1]);
  }

  get hasAnyOverlap() {
    const [elf1, elf2] = this.assignment;
    return (elf1[0] >= elf2[0] && elf1[0] <= elf2[1]) || (elf2[0] >= elf1[0] && elf2[0] <= elf1[1]);
  }
}

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(line => new Assignment(line));

console.log(`Part 1: ${inputData.filter(assignment => assignment.hasFullOverlap).length}`);
console.log(`Part 2: ${inputData.filter(assignment => assignment.hasAnyOverlap).length}`);



