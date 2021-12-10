import * as fs from 'node:fs';

class Line {
  constructor(data) {
    this.data = data;
    this.validate();
  }

  validate() {
    const instructionMap = { '[': ']', '(': ')', '<': '>', '{': '}' };
    const openingBrackets = Object.keys(instructionMap);
    const chunks = this.data.split('');

    while (chunks.length) {
      const openingIndex = chunks.findIndex(instruction => !openingBrackets.includes(instruction)) - 1;

      if (openingIndex < 0) {
        this.isIncomplete = true;
        this.missing = chunks.toReversed().map(instruction => instructionMap[instruction]);
        break;
      }

      const openingInstruction = chunks[openingIndex];

      if (chunks[openingIndex + 1] !== instructionMap[openingInstruction]) {
        this.isInvalid = true;
        this.expected = instructionMap[openingInstruction];
        this.found = chunks[openingIndex + 1];
        break;
      }

      chunks.splice(openingIndex, 2);
    }
  }
}

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new Line(data));
const syntaxErrorScoreTable = { ')': 3, ']': 57, '}': 1197, '>': 25137 };
const syntaxErrorScore = inputData.filter(line => line.isInvalid).reduce((acc, cur) => acc + syntaxErrorScoreTable[cur.found], 0);

console.log(`Part 1: ${syntaxErrorScore}`);

const missingCharsTable = { ')': 1, ']': 2, '}': 3, '>': 4 };
const getMissingCharScore = line => line.missing.reduce((acc, cur) => acc * 5 + missingCharsTable[cur], 0);
const missingCharScores = inputData.filter(line => line.isIncomplete).map(getMissingCharScore).toSorted((a, b) => a - b);

console.log(`Part 2: ${missingCharScores[Math.floor(missingCharScores.length / 2)]}`);
