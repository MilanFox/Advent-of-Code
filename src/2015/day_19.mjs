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

const [replacementData, sourceMolecule] = fs.readFileSync('input.txt', 'utf-8').trim().split('\n\n');
const replacements = replacementData.split('\n').map(data => new Replacement(data));

const moleculesAfterOneReplacement = new Set(replacements.flatMap(replacement => replacement.replaceForward(sourceMolecule)));
console.log(`Part 1: ${moleculesAfterOneReplacement.size}`);

const findPathLength = (sourceMolecule, targetMolecule) => {
  replacements.sort((a, b) => b.out.length - a.out.length);
  const queue = [[targetMolecule, 0]];
  const visited = new Set();

  while (queue.length) {
    queue.sort(([a], [b]) => a.length - b.length);
    const [currentMolecule, localLength] = queue.shift();
    if (currentMolecule === sourceMolecule) return localLength;
    replacements.forEach(replacement => replacement
      .replaceBackwards(currentMolecule)
      .forEach(mol => {
        if (!visited.has(mol)) {
          queue.push([mol, localLength + 1]);
          visited.add(mol);
        }
      }));
  }

  return null;
};

console.log(`Part 2: ${findPathLength('e', sourceMolecule)}`); // Needs optimization... never finishes for real data.

