import fs from 'node:fs';

class Password {
  constructor(seed) {
    this.value = this.decode(seed);
  }

  decode(str) { return [...str].map(char => char.charCodeAt(0)).toReversed(); }
  encode(arr) { return arr.map(char => String.fromCharCode(char)).toReversed().join('');}

  increment() {
    let i = 0;
    let remainder = 0;

    do {
      let nextValue = (this.value[i] ?? 96) + 1;
      if (['i', 'o', 'l'].map(char => char.charCodeAt(0)).includes(nextValue)) nextValue += 1;
      remainder = Math.floor((nextValue - 97) / 26);
      this.value[i] = nextValue - (remainder * 26);
      i += 1;
    } while (remainder);
  }

  get string() { return this.encode(this.value); }

  get hasIncreasingStraight() { return this.value.some((char, i, arr) => arr[i + 1] === char - 1 && arr[i + 2] === char - 2); }
  get avoidsBannedLetters() { return ['i', 'o', 'l'].every(letter => !this.value.includes(letter.charCodeAt(0))); }
  get hasRepeatingPairs() { return this.string.match(/(.)\1*/g).reduce((acc, cur) => acc + Math.floor(cur.length / 2), 0) >= 2; }
  get isValid() { return [this.hasIncreasingStraight, this.avoidsBannedLetters, this.hasRepeatingPairs,].every(Boolean); }
}

const seed = fs.readFileSync('input.txt', 'utf-8').trim();

const findNextPassword = (seed) => {
  const pw = new Password(seed);
  do { pw.increment(); } while (!pw.isValid);
  return pw.string;
};

const nextPassword = findNextPassword(seed);

console.log(`Part 1: ${nextPassword}`);
console.log(`Part 2: ${findNextPassword(nextPassword)}`);
