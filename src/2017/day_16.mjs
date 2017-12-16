import * as fs from 'node:fs';

const instructions = fs.readFileSync('input.txt', 'utf-8').trim().split(',');

const programs = [...'abcdefghijklmnop'];

const getCurrentOrder = () => programs.join('');

const danceOneRound = () => {
  instructions.forEach(instruction => {
    const type = instruction[0];
    let match;

    switch (type) {
      case 's':
        match = /s(\d+)/.exec(instruction);
        const size = parseInt(match[1]);
        programs.unshift(...programs.splice(-size));
        break;
      case 'x':
        match = /x(\d+)\/(\d+)/.exec(instruction);
        const left = parseInt(match[1]);
        const right = parseInt(match[2]);
        [programs[left], programs[right]] = [programs[right], programs[left]];
        break;
      case 'p':
        match = /p(\w)\/(\w)/.exec(instruction);
        const partner1 = match[1];
        const partner2 = match[2];
        const index1 = programs.indexOf(partner1);
        const index2 = programs.indexOf(partner2);
        [programs[index1], programs[index2]] = [programs[index2], programs[index1]];
        break;
    }
  });
};

const memo = new Map();

const dance = (rounds) => {
  for (let i = 0; i < rounds; i++) {
    const currentOrder = getCurrentOrder();

    if (memo.get(currentOrder)) {
      const periodLength = i - 1;
      const order = Array.from(memo);
      const remainder = rounds % periodLength;
      console.log(`Part 1: ${order[1][0]}`);
      console.log(`Part 2: ${order[remainder][0]}`);
      return;
    }

    memo.set(currentOrder, i);
    danceOneRound();
  }
};

dance(1_000_000_000);
