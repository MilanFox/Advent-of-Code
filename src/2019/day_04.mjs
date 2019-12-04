import * as fs from 'node:fs';

const [lower, upper] = fs.readFileSync('input.txt', 'utf-8').trim().split('-').map(n => parseInt(n));

const hasIncreasingDigits = (number) => {
  const digits = number.toString().split('').map(n => parseInt(n));
  for (let i = 1; i < digits.length; i++) {
    if (digits[i] < digits[i - 1]) return false;
  }
  return true;
};

const hasTwoIdenticalNeighbors = (number) => {
  const digits = number.toString();
  for (let i = 1; i < digits.length; i++) {
    if (digits[i] === digits[i - 1]) return true;
  }
  return false;
};

const validators = [hasIncreasingDigits, hasTwoIdenticalNeighbors];
const validate = (number) => validators.every(validator => validator(number));

const findValidPasswords = () => {
  let validPasswords = 0;
  for (let i = lower; i <= upper; i++) {
    if (validate(i)) validPasswords++;
  }
  return validPasswords;
};

console.log(`Part 1: ${findValidPasswords()}`);

const hasEvenNumberOfIdenticalNeighbors = (number) => {
  const digits = number.toString().split('');
  const count = {};
  digits.forEach(el => count[el] = (count[el] || 0) + 1);
  return Object.values(count).some(val => val === 2);
};

validators[1] = hasEvenNumberOfIdenticalNeighbors;
console.log(`Part 2: ${findValidPasswords()}`);
