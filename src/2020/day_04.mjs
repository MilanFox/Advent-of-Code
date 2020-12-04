import * as fs from 'node:fs';

class Passport {
  constructor(data) {
    const sets = data.split(/\s+/).map(set => set.split(':'));
    sets.forEach(([key, value]) => this[key] = value);
  }

  #required = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
  #optional = ['cid'];

  get allRequired() {
    return this.#required.every(key => this[key] !== undefined);
  }

  #validate = {
    _number: (input, lower, upper) => parseInt(input) >= lower && parseInt(input) <= upper,
    _year: (input, lower, upper) => input.length === 4 && this.#validate._number(input, lower, upper),
    byr: (input) => this.#validate._year(input, 1920, 2002),
    iyr: (input) => this.#validate._year(input, 2010, 2020),
    eyr: (input) => this.#validate._year(input, 2020, 2030),
    hgt: (input) => input.endsWith('in') ? this.#validate._number(input, 59, 76) : input.endsWith('cm') ? this.#validate._number(input, 150, 193) : false,
    hcl: (input) => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(input),
    ecl: (input) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(input),
    pid: (input) => input.length === 9 & Boolean(parseInt(input)),
  };

  get isValid() {
    if (!this.allRequired) return false;
    return this.#required.every(field => this.#validate[field](this[field]));
  }
}

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n\n').map(data => new Passport(data));

console.log(`Part 1: ${inputData.filter(passport => passport.allRequired).length}`);
console.log(`Part 2: ${inputData.filter(passport => passport.isValid).length}`);
