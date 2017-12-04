import * as fs from 'node:fs';

class PassPhrase {
  constructor(phrase) {
    this.phrase = phrase.split(' ');
  }

  get isValidWeakly() {
    return this.phrase.length === new Set(this.phrase).size;
  }

  get isValidStrongly() {
    const sortedPhrases = this.phrase.map(word => word.split('').toSorted().join(''));
    return sortedPhrases.length === new Set(sortedPhrases).size;
  }
}

const passPhrases = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(line => new PassPhrase(line));

console.log(`Part 1: ${passPhrases.filter(phrase => phrase.isValidWeakly).length}`);
console.log(`Part 2: ${passPhrases.filter(phrase => phrase.isValidStrongly).length}`);
