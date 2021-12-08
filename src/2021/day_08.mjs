import * as fs from 'node:fs';

class Digit {
  constructor(data) {
    this.id = data.split('').sort().join('');
    this.length = this.id.length;

    if (this.length === 2) this.is = 1;
    if (this.length === 4) this.is = 4;
    if (this.length === 3) this.is = 7;
    if (this.length === 7) this.is = 8;
  }

  get isUnidentified() {
    return this.is === undefined;
  }
}

class Display {
  constructor(data) {
    const [inputValues, outputValues] = data.split(' | ');
    this.inputValues = inputValues.split(' ').map(value => new Digit(value));
    this.outputValues = outputValues.split(' ').map(value => this.inputValues.find(digit => digit.id === value.split('').sort().join('')));

    this.inputValues.forEach(digit => { if (digit.is !== undefined) this.digits[digit.is] = digit; });
    this.identifyRemainingDigits();
  }

  digits = {};

  get unidentified() {
    return this.inputValues.filter(digit => digit.isUnidentified);
  }

  identifyAs = (number, digit) => {
    digit.is = number;
    this.digits[number] = digit;
  };

  overlaps(digitA, digitB) {
    return digitB.id.split('').every(segment => digitA.id.split('').includes(segment));
  };

  identifyRemainingDigits() {
    this.identifyAs(6, this.unidentified.find(digit => digit.length === 6 && !this.overlaps(digit, this.digits[1])));
    this.identifyAs(9, this.unidentified.find(digit => digit.length === 6 && this.overlaps(digit, this.digits[4])));
    this.identifyAs(0, this.unidentified.find(digit => digit.length === 6));
    this.identifyAs(3, this.unidentified.find(digit => this.overlaps(digit, this.digits[1])));
    this.identifyAs(5, this.unidentified.find(digit => this.overlaps(this.digits[9], digit)));
    this.identifyAs(2, this.unidentified[0]);
  }

  get output() {
    return parseInt(this.outputValues.map(digit => digit.is).join(''));
  }
}

const displays = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new Display(data));

const immediatelyIdentifiable = [1, 4, 7, 8];
const immediatelyIdentifiedNumbers = displays.reduce((acc, cur) => acc + cur.outputValues.filter(value => immediatelyIdentifiable.includes(value.is)).length, 0);

console.log(`Part 1: ${immediatelyIdentifiedNumbers}`);
console.log(`Part 2: ${displays.reduce((acc, cur) => acc + cur.output, 0)}`);
