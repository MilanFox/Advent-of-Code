import { readFileSync } from 'node:fs';

class IPv7 {
  constructor(data) {
    this.regularSequences = data.match(/^[a-z]+|[a-z]+$|(?<=])[a-z]+(?=\[)/g);
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
    
    return this.regularSequences.some(hasBypass) && !this.hypernetSequences.some(hasBypass);
  }
}

const ips = readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new IPv7(data));

const vulnerableIPs = ips.filter(ip => ip.supportsTLS);
console.log(`Part 1: ${vulnerableIPs.length}`);
