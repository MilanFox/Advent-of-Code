import { readFileSync } from 'node:fs';

class Device {
  constructor(data) {
    const [before, instruction, after] = data.split('\n');
    this.register = [...before.matchAll(/\d+/g)].map(match => Number(match[0]));
    this.instruction = [...instruction.matchAll(/\d+/g)].map(match => Number(match[0]));
    this.measuredResult = [...after.matchAll(/\d+/g)].map(match => Number(match[0]));
  }

  operations = {
    addr: ([, A, B, C]) => { this.register[C] = this.register[A] + this.register[B]; },
    addi: ([, A, B, C]) => { this.register[C] = this.register[A] + B; },
    mulr: ([, A, B, C]) => { this.register[C] = this.register[A] * this.register[B]; },
    muli: ([, A, B, C]) => { this.register[C] = this.register[A] * B; },
    banr: ([, A, B, C]) => { this.register[C] = this.register[A] & this.register[B]; },
    bani: ([, A, B, C]) => { this.register[C] = this.register[A] & B; },
    borr: ([, A, B, C]) => { this.register[C] = this.register[A] | this.register[B]; },
    bori: ([, A, B, C]) => { this.register[C] = this.register[A] | B; },
    setr: ([, A, , C]) => { this.register[C] = this.register[A]; },
    seti: ([, A, , C]) => { this.register[C] = A; },
    gtir: ([, A, B, C]) => { this.register[C] = A > this.register[B] ? 1 : 0; },
    gtri: ([, A, B, C]) => { this.register[C] = this.register[A] > B ? 1 : 0; },
    gtrr: ([, A, B, C]) => { this.register[C] = this.register[A] > this.register[B] ? 1 : 0; },
    eqir: ([, A, B, C]) => { this.register[C] = A === this.register[B] ? 1 : 0; },
    eqri: ([, A, B, C]) => { this.register[C] = this.register[A] === B ? 1 : 0; },
    eqrr: ([, A, B, C]) => { this.register[C] = this.register[A] === this.register[B] ? 1 : 0; },
  };

  get probeScore() {
    return Object.values(this.operations).reduce((acc, fn) => {
      const initialRegister = [...this.register];
      fn(this.instruction);
      const matchesExpectation = this.register.every((val, i) => val === this.measuredResult[i]);
      this.register = initialRegister;
      return matchesExpectation ? acc + 1 : acc;
    }, 0);
  }
}

const [instructions] = readFileSync('input.txt', 'utf-8').trim().split('\n\n\n');

const numberOfIndefiniteResults = instructions
  .split('\n\n')
  .map(data => new Device(data).probeScore)
  .filter(score => score >= 3);

console.log(`Part 1: ${numberOfIndefiniteResults.length}`);
