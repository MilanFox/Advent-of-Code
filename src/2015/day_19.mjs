import fs from 'node:fs';

class Replacement {
  constructor(data) {
    [this.in, this.out] = data.split(' => ');
  }

  getMoleculesAfterReplacement(molecule) {
    return molecule
      .split(this.in)
      .flatMap((_, i, arr) => i > 0 ? [arr.slice(0, i).join(this.in) + this.out + arr.slice(i).join(this.in)] : []);
  }
}

const [replacementData, startingPoint] = fs.readFileSync('input.txt', 'utf-8').trim().split('\n\n');
const replacements = replacementData.split('\n').map(data => new Replacement(data));

const moleculesAfterOneReplacement = new Set(replacements.flatMap(replacement => replacement.getMoleculesAfterReplacement(startingPoint)));
console.log(`Part 1: ${moleculesAfterOneReplacement.size}`);
