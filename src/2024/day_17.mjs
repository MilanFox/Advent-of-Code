import fs from 'node:fs';

class Program {
  constructor([registerData, programData]) {
    this.register = {};
    [this.register.A, this.register.B, this.register.C] = registerData.match(/\d+/g).map(Number);
    this.instructions = programData.match(/\d+/g).map(Number);
    this.pointer = 0;
    this.output = [];
  }

  get formatedOutput() { return this.output.join(','); }

  getComboOperand(operand) {
    if (operand >= 0 && operand <= 3) return operand;
    if (operand === 4) return this.register.A;
    if (operand === 5) return this.register.B;
    if (operand === 6) return this.register.C;
  }

  adv(operand) {
    this.register.A = Math.trunc(this.register.A / (2 ** this.getComboOperand(operand)));
  }

  bxl(operand) {
    this.register.B ^= operand;
  }

  bst(operand) {
    this.register.B = this.getComboOperand(operand) % 8;
  }

  jnz(operand) {
    if (this.register.A === 0) return false;
    this.pointer = operand;
    return true;
  }

  bxc() {
    this.register.B ^= this.register.C;
  }

  out(operand) {
    this.output.push(this.getComboOperand(operand) % 8);
  }

  bdv(operand) {
    this.register.B = Math.trunc(this.register.A / (2 ** this.getComboOperand(operand)));
  }

  cdv(operand) {
    this.register.C = Math.trunc(this.register.A / (2 ** this.getComboOperand(operand)));
  }

  run() {
    const opCodeLookup = [
      this.adv.bind(this),
      this.bxl.bind(this),
      this.bst.bind(this),
      this.jnz.bind(this),
      this.bxc.bind(this),
      this.out.bind(this),
      this.bdv.bind(this),
      this.cdv.bind(this),
    ];

    while (this.pointer < this.instructions.length) {
      const opcode = this.instructions[this.pointer];
      const operand = this.instructions[this.pointer + 1];
      const jumped = opCodeLookup[opcode](operand);
      if (!jumped) this.pointer += 2;
    }
  }
}

const program = new Program(fs.readFileSync('input.txt', 'utf-8').trim().split('\n\n'));

program.run();
console.log(`Part 1: ${program.formatedOutput}`);
