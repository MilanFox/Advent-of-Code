import * as fs from 'node:fs';

class SoundFile {
  constructor(instructions) {
    this.instructions = instructions;
    instructions.forEach(instruction => instruction.linkRegisters(this.registers));

    const neededRegisters = [...new Set(this.instructions.map(({ registerDependencies }) => registerDependencies).flat())];
    neededRegisters.forEach(id => this.registers[id] = 0);
  }

  #pointer = 0;
  registers = {};
  lastPlayed = undefined;

  run() {
    while (this.#pointer < this.instructions.length) {
      const cur = this.instructions[this.#pointer];
      switch (cur.cmd) {
        case 'snd':
          this.lastPlayed = cur.getParam('value');
          this.#pointer += 1;
          break;
        case 'set':
          this.registers[cur.params.target] = cur.getParam('value');
          this.#pointer += 1;
          break;
        case 'add':
          this.registers[cur.params.target] += cur.getParam('value');
          this.#pointer += 1;
          break;
        case 'mul':
          this.registers[cur.params.target] *= cur.getParam('value');
          this.#pointer += 1;
          break;
        case 'mod':
          this.registers[cur.params.target] %= cur.getParam('value');
          this.#pointer += 1;
          break;
        case 'rcv':
          if (!cur.getParam('value')) {
            this.#pointer += 1;
            break;
          }
          return;
        case 'jgz':
          if (cur.getParam('value') <= 0) {
            this.#pointer += 1;
            break;
          }
          this.#pointer += cur.getParam('offset');
      }
    }
  }
}

class Instruction {
  constructor(data) {
    const [cmd, param1, param2] = data.split(' ');

    this.cmd = cmd;

    if (['snd', 'rcv'].includes(cmd)) this.params.value = Number.isNaN(parseInt(param1)) ? param1 : parseInt(param1);

    if (['set', 'add', 'mul', 'mod'].includes(cmd)) {
      this.params.target = param1;
      this.params.value = Number.isNaN(parseInt(param2)) ? param2 : parseInt(param2);
    }

    if (cmd === 'jgz') {
      this.params.offset = Number.isNaN(parseInt(param2)) ? param2 : parseInt(param2);
      this.params.value = Number.isNaN(parseInt(param1)) ? param1 : parseInt(param1);
    }
  }

  params = {};

  getParam(param) {
    if (typeof this.params[param] === 'number') return this.params[param];
    else return this.registers[this.params[param]];
  }

  linkRegisters(registers) {
    this.registers = registers;
  }

  get registerDependencies() {
    return Object.values(this.params).filter(el => typeof el === 'string');
  }
}

const soundFile = new SoundFile(fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new Instruction(data)));

soundFile.run();

console.log(soundFile.lastPlayed);
