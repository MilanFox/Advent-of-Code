import fs from 'node:fs';

class Replacement {
  constructor(data) {
    [this.in, this.out] = data.split(' => ');
  }

  replaceForward(molecule) {
    return this.#replace(molecule, this.in, this.out);
  }

  replaceBackwards(molecule) {
    return this.#replace(molecule, this.out, this.in);
  }

  #replace(molecule, from, to) {
    const parts = molecule.split(from);
    return parts.slice(1).map((_, i) => parts.slice(0, i + 1).join(from) + to + parts.slice(i + 1).join(from));
  }
}

const [replacementData, testMolecule] = fs.readFileSync('input.txt', 'utf-8').trim().split('\n\n');
const replacements = replacementData.split('\n').map(data => new Replacement(data));

const moleculesAfterOneReplacement = new Set(replacements.flatMap(replacement => replacement.replaceForward(testMolecule)));
console.log(`Part 1: ${moleculesAfterOneReplacement.size}`);
