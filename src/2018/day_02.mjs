import * as fs from 'node:fs';

class Box {
  constructor(id) {
    this.id = id;
  }

  get letterCount() {
    return this.id.split('').reduce((acc, cur) => {
      acc[cur] = (acc[cur] || 0) + 1;
      return acc;
    }, {});
  }

  get hasSetOfTwoLetters() {
    return Object.values(this.letterCount).some(count => count === 2);
  }

  get hasSetOfThreeLetters() {
    return Object.values(this.letterCount).some(count => count === 3);
  }
}

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(id => new Box(id));

const checksum = inputData.filter(box => box.hasSetOfTwoLetters).length * inputData.filter(box => box.hasSetOfThreeLetters).length;
console.log(`Part 1: ${checksum}`);

const getComparisonLevel = (boxA, boxB) => {
  const lettersA = boxA.id.split('');
  const lettersB = boxB.id.split('');
  return lettersA.reduce((acc, cur, i) => acc + (cur !== lettersB[i]), 0);
};

const findPrototypeBoxes = (boxes) => {
  let i = 0;
  while (true) {
    for (let j = i + 1; j < boxes.length; j++) {
      if (getComparisonLevel(boxes[i], boxes[j]) === 1) return [boxes[i], boxes[j]];
    }
    i += 1;
  }
};

const prototypeBoxes = findPrototypeBoxes(inputData);
const commonLetters = [...prototypeBoxes[0].id].filter((char, index) => char === prototypeBoxes[1].id[index]).join('');
console.log(`Part 2: ${commonLetters}`);
