import fs from 'node:fs';

class Instruction {
  constructor(data) {
    const [source, dest] = data.split(' -> ');
    this.parse(source);
    this.source1 = isNaN(parseInt(this.source1)) ? this.source1 : parseInt(this.source1);
    if (this.source2) this.source2 = isNaN(parseInt(this.source2)) ? this.source2 : parseInt(this.source2);
    this.dest = dest;
  }

  parse(source) {
    if (source.includes('NOT')) {
      [this.operator, this.source1] = source.split(' ');
      return;
    }

    if (source.split(' ').length === 1) {
      this.source1 = source;
      return;
    }

    [this.source1, this.operator, this.source2] = source.split(' ');
  }
}

class Wire {
  get value() {
    if (this._value) return this._value;

    const getValue = (param) => typeof param === 'number' ? param : circuit.wires[param].value;

    switch (this.operator) {
      case 'NOT':
        this._value = ~getValue(this.source1) & 0xFFFF;
        break;
      case 'AND':
        this._value = getValue(this.source1) & getValue(this.source2);
        break;
      case 'OR':
        this._value = getValue(this.source1) | getValue(this.source2);
        break;
      case 'LSHIFT':
        this._value = getValue(this.source1) << getValue(this.source2);
        break;
      case 'RSHIFT':
        this._value = getValue(this.source1) >> getValue(this.source2);
        break;
      default:
        this._value = getValue(this.source1);
    }

    return this._value;
  }

  reset() { this._value = undefined; }
}

class Circuit {
  constructor(instructions) {
    instructions.forEach(({ dest }) => this.wires[dest] = new Wire());
    instructions.forEach(({ dest, source1, source2, operator }) => {
      if (operator !== undefined) this.wires[dest].operator = operator;
      if (source1 !== undefined) this.wires[dest].source1 = source1;
      if (source2 !== undefined) this.wires[dest].source2 = source2;
    });
  }

  wires = {};
}

const instructions = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new Instruction(data));
const circuit = new Circuit(instructions);

const signalA = circuit.wires.a.value;
console.log(`Part 1: ${signalA}`);

Object.values(circuit.wires).forEach(wire => wire.reset());
circuit.wires.b._value = signalA;
console.log(`Part 2: ${circuit.wires.a.value}`);
