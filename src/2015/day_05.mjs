import fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n');

const rules = {
  hasMinimumThreeVowels: (string) => [...string].filter(char => [...'aeiou'].includes(char)).length >= 3,
  hasDoubleLetter: (string) => [...string].some((char, i) => char === string[i + 1]),
  avoidsBannedSubstrings: (string) => ['ab', 'cd', 'pq', 'xy'].every(subString => !string.includes(subString)),
  hasDisjoinedDoubleLetter: (string) => [...string].some((char, i) => char === string[i + 2]),
  hasRepeatingDoubleLetters: (string) => {
    for (let i = 0; i < string.length - 1; i++) {
      const subString = string.substring(i, i + 2);
      if (string.lastIndexOf(subString) - string.indexOf(subString) >= 2) return true;
    }
    return false;
  },
};

const oldRules = [rules.hasMinimumThreeVowels, rules.hasDoubleLetter, rules.avoidsBannedSubstrings];
const newRules = [rules.hasDisjoinedDoubleLetter, rules.hasRepeatingDoubleLetters];

const isNice = (string, rules) => rules.every(rule => rule(string));

console.log(`Part 1: ${inputData.reduce((acc, cur) => acc + isNice(cur, oldRules), 0)}`);
console.log(`Part 2: ${inputData.reduce((acc, cur) => acc + isNice(cur, newRules), 0)}`);
