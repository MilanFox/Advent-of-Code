import fs from 'node:fs';

class AuntSue {
  constructor(data) {
    const parser = /^Sue (?<id>\d+): (?<attributes>.*)/;
    const { id, attributes } = parser.exec(data).groups;
    this.id = Number(id);
    attributes.split(', ').forEach(attr => {
      const [key, value] = attr.split(': ');
      this[key] = Number(value);
    });
  }
}

const aunts = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new AuntSue(data));

const mfcsamScan = [
  ['children', 3],
  ['cats', 7],
  ['samoyeds', 2],
  ['pomeranians', 3],
  ['akitas', 0],
  ['vizslas', 0],
  ['goldfish', 5],
  ['trees', 3],
  ['cars', 2],
  ['perfumes', 1],
];

const giftingAunt1 = aunts.find(aunt => mfcsamScan.every(([key, val]) => aunt[key] === val || aunt[key] === undefined));
console.log(`Part 1: ${giftingAunt1.id}`);

const giftingAunt2 = aunts.find(aunt => mfcsamScan.every(([key, val]) => {
  if (aunt[key] === undefined) return true;
  if (['cats', 'trees'].includes(key)) return aunt[key] >= val;
  if (['pomeranians', 'goldfish'].includes(key)) return aunt[key] <= val;
  else return aunt[key] === val;
}));
console.log(`Part 2: ${giftingAunt2.id}`);
