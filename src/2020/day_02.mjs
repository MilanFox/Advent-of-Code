import * as fs from 'node:fs';

class Password {
  constructor(data) {
    const [policy, character, password] = data.split(' ');
    [this.policy.lower, this.policy.upper] = policy.split('-').map(n => parseInt(n));
    this.character = character.slice(0, -1);
    this.password = password;
  }

  policy = {};

  get isValidForPart1() {
    let count = 0;
    for (let i = 0; i < this.password.length; i++) {
      if (this.password[i] === this.character) count += 1;
    }
    return count >= this.policy.lower && count <= this.policy.upper;
  }

  get isValidForPart2() {
    return (this.password[this.policy.lower - 1] === this.character) !== (this.password[this.policy.upper - 1] === this.character);
  }
}

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new Password(data));

console.log(`Part 1: ${inputData.filter(password => password.isValidForPart1).length}`);
console.log(`Part 2: ${inputData.filter(password => password.isValidForPart2).length}`);
