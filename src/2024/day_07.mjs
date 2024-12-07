import fs from 'node:fs';

class Calibration {
  constructor(data) {
    const [_result, _numbers] = data.split(': ');
    this.result = parseInt(_result);
    this.numbers = _numbers.split(' ').map(Number);
  }

  #operations = {
    add: (a, b) => a + b,
    mult: (a, b) => a * b,
    concat: (a, b) => parseInt(`${a}${b}`),
  };

  #memo = {};

  isPossible(operators) {
    if (this.#memo[operators]) return this.#memo[operators];
    const stack = operators.map(op => [[...this.numbers], op]);
    let isPossible = false;

    while (stack.length) {
      const [numbers, op] = stack.pop();
      const a = numbers.shift();

      numbers[0] = this.#operations[op](a, numbers[0]);
      if (numbers[0] > this.result) continue;

      if (numbers.length === 1) {
        if (numbers[0] !== this.result) continue;
        isPossible = true;
        break;
      }

      operators.forEach(op => { stack.push([[...numbers], op]); });
    }

    this.#memo[operators] = isPossible;
    return isPossible;
  }
}

const calibrations = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new Calibration(data));

const checkSum1 = calibrations
  .filter(calibration => calibration.isPossible(['add', 'mult']))
  .reduce((acc, cur) => acc + cur.result, 0);

console.log(`Part 1: ${checkSum1}`);

const checkSum2 = calibrations
  .filter(calibrations => !calibrations.isPossible(['add', 'mult']))
  .filter(calibration => calibration.isPossible(['add', 'mult', 'concat']))
  .reduce((acc, cur) => acc + cur.result, 0);

console.log(`Part 2: ${checkSum1 + checkSum2}`);
