import { readFileSync } from 'node:fs';

class Device {
  constructor(testData) {
    if (testData) {
      const [before, instruction, after] = testData.split('\n');
      this.register = [...before.matchAll(/\d+/g)].map(match => Number(match[0]));
      this.testInstruction = [...instruction.matchAll(/\d+/g)].map(match => Number(match[0]));
      this.measuredResult = [...after.matchAll(/\d+/g)].map(match => Number(match[0]));
    } else {
      this.register = [0, 0, 0, 0];
    }
  }

  #operations = [
    ([, A, B, C]) => { this.register[C] = this.register[A] + this.register[B]; },
    ([, A, B, C]) => { this.register[C] = this.register[A] + B; },
    ([, A, B, C]) => { this.register[C] = this.register[A] * this.register[B]; },
    ([, A, B, C]) => { this.register[C] = this.register[A] * B; },
    ([, A, B, C]) => { this.register[C] = this.register[A] & this.register[B]; },
    ([, A, B, C]) => { this.register[C] = this.register[A] & B; },
    ([, A, B, C]) => { this.register[C] = this.register[A] | this.register[B]; },
    ([, A, B, C]) => { this.register[C] = this.register[A] | B; },
    ([, A, , C]) => { this.register[C] = this.register[A]; },
    ([, A, , C]) => { this.register[C] = A; },
    ([, A, B, C]) => { this.register[C] = A > this.register[B] ? 1 : 0; },
    ([, A, B, C]) => { this.register[C] = this.register[A] > B ? 1 : 0; },
    ([, A, B, C]) => { this.register[C] = this.register[A] > this.register[B] ? 1 : 0; },
    ([, A, B, C]) => { this.register[C] = A === this.register[B] ? 1 : 0; },
    ([, A, B, C]) => { this.register[C] = this.register[A] === B ? 1 : 0; },
    ([, A, B, C]) => { this.register[C] = this.register[A] === this.register[B] ? 1 : 0; },
  ];

  execute(instr, params) { this.#operations[instr](params); }

  probe() {
    return this.#operations.reduce((acc, fn, i) => {
      const initialRegister = [...this.register];
      fn(this.testInstruction);
      const matchesExpectation = this.register.every((val, i) => val === this.measuredResult[i]);
      this.register = initialRegister;
      if (matchesExpectation) acc.matches.push(i);
      return acc;
    }, {
      matches: [],
      instruction: this.testInstruction,
    });
  }
}

const [instructions, programData] = readFileSync('input.txt', 'utf-8').trim().split('\n\n\n\n');

const numberOfIndefiniteResults = instructions
  .split('\n\n')
  .map(data => new Device(data, { isInTestMode: true }).probe())
  .filter(result => result.matches.length >= 3);

console.log(`Part 1: ${numberOfIndefiniteResults.length}`);

const solveOpCodes = () => {
  const map = Object.fromEntries(Array.from({ length: 16 }, (_, i) => ([i, undefined])));
  const isResolved = opIdx => Object.values(map).includes(opIdx);

  let unsolvedRuns = instructions.split('\n\n').map(data => new Device(data).probe());

  while (unsolvedRuns.length) {
    const solved = unsolvedRuns.filter(result => result.matches.filter(opIdx => !isResolved(opIdx)).length === 1);
    solved.forEach(result => {
      const opIdx = result.matches.filter(opIdx => !isResolved(opIdx))[0];
      if (opIdx !== undefined) map[result.instruction[0]] = opIdx;
    });

    unsolvedRuns = unsolvedRuns.filter(result => result.matches.some(opIdx => !isResolved(opIdx)));
  }

  return map;
};

const opCodeMap = solveOpCodes();
const program = programData.split('\n').map(line => [...line.matchAll(/\d+/g)].map(match => Number(match[0])));

const device = new Device();
program.forEach(line => device.execute(opCodeMap[line[0]], line));
console.log(`Part 2: ${device.register[0]}`);
