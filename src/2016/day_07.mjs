import { readFileSync } from 'node:fs';

class IPv7 {
  constructor(data) {
    this.supernetSequences = data.match(/^[a-z]+|[a-z]+$|(?<=])[a-z]+(?=\[)/g);
    this.hypernetSequences = data.match(/(?<=\[)[a-z]+(?=])/g);
  }

  get supportsTLS() {
    const hasBypass = (sequence) => {
      let hasBypass = false;

      for (let i = 0; i <= sequence.length - 4; i++) {
        const hasMatchingPairA = sequence.at(i) === sequence.at(i + 3);
        const hasMatchingPairB = sequence.at(i + 1) === sequence.at(i + 2);
        const hasTwoDifferentPairs = sequence.at(i) !== sequence.at(i + 1);

        if (hasMatchingPairA && hasMatchingPairB && hasTwoDifferentPairs) {
          hasBypass = true;
          break;
        }
      }
      return hasBypass;
    };

    return this.supernetSequences.some(hasBypass) && !this.hypernetSequences.some(hasBypass);
  }

  get supportsSSL() {
    const abaSequences = Array.from(new Set(this.supernetSequences.flatMap(seq => {
      const foundSequences = new Set();
      for (let i = 0; i < seq.length - 2; i++) {
        if (seq[i] === seq[i + 2] && seq[i] !== seq[i + 1]) foundSequences.add(seq.substring(i, i + 3));
      }
      return Array.from(foundSequences);
    })));

    return abaSequences.some(aba => {
      const bab = `${aba[1]}${aba[0]}${aba[1]}`;
      return this.hypernetSequences.some(seq => seq.includes(bab));
    });
  }
}

const ips = readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new IPv7(data));

console.log(`Part 1: ${ips.filter(ip => ip.supportsTLS).length}`);
console.log(`Part 2: ${ips.filter(ip => ip.supportsSSL).length}`);
