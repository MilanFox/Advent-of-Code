import fs from 'node:fs';

class EvaluationString {
  constructor(data) {
    this.string = data;
    this.chars = [...data];
  }

  get hasMinimumThreeVowels() {
    return this.chars.filter(char => [...'aeiou'].includes(char)).length >= 3;
  }

  get hasDoubleLetter() {
    return this.chars.some((char, i) => char === this.chars[i + 1]);
  }

  get avoidsBannedSubstrings() {
    return ['ab', 'cd', 'pq', 'xy'].every(subString => !this.string.includes(subString));
  }

  get hasDisjoinedDoubleLetter() {
    return this.chars.some((char, i) => char === this.chars[i + 2]);
  }

  get hasRepeatingDoubleLetters() {
    for (let i = 0; i < this.chars.length - 1; i++) {
      const subString = this.string.substring(i, i + 2);
      if (this.string.lastIndexOf(subString) - this.string.indexOf(subString) >= 2) return true;
    }
    return false;
  }

  get isNiceByOldRules() {
    return [this.hasMinimumThreeVowels, this.hasDoubleLetter, this.avoidsBannedSubstrings].every(val => val === true);
  }

  get isNiceByNewRules() {
    return [this.hasRepeatingDoubleLetters, this.hasDisjoinedDoubleLetter].every(val => val === true);
  }
}

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new EvaluationString(data));

console.log(`Part 1: ${inputData.filter(string => string.isNiceByOldRules).length}`);
console.log(`Part 2: ${inputData.filter(string => string.isNiceByNewRules).length}`);
