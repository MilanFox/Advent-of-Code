import * as fs from 'node:fs';

const inputFile = fs.readFileSync('input.txt', 'utf-8');
const trueSymbols = /[^0-9.\n]/;
const map = inputFile.trim().split('\n');

const findNumbersInLine = (lineNumber) => {
  const line = map[lineNumber];
  const foundNumbers = [];
  let foundNumber = { number: '', line: lineNumber };

  [...line].forEach((char, index) => {
    if (!isNaN(parseInt(char))) {
      foundNumber.number += char;
      const nextIndex = index + 1;

      if (!foundNumber.hasOwnProperty('start')) foundNumber.start = index;

      if (isNaN(parseInt(line[nextIndex]))) {
        foundNumber.end = index;

        const start = Math.max(foundNumber.start - 1, 0);
        const range = foundNumber.end - foundNumber.start + 3 + Math.min(foundNumber.start - 1, 0);
        foundNumber.adjacent = new Set([...line].splice(start, range));

        try {
          const adjacentInPrev = [...map[lineNumber - 1]].splice(start, range);
          adjacentInPrev.forEach(char => {foundNumber.adjacent.add(char);});
        } catch (e) {
        }

        try {
          const adjacentInNext = [...map[lineNumber + 1]].splice(start, range);
          adjacentInNext.forEach(char => {foundNumber.adjacent.add(char);});
        } catch (e) {
        }

        foundNumber.adjacent = [...foundNumber.adjacent].filter(char => char.match(trueSymbols));
        foundNumbers.push(foundNumber);
        foundNumber = { number: '', line: lineNumber };
      }
    }
  });

  return foundNumbers;
};

const allPartNumbers = map
  .reduce((acc, _, index) => acc.concat(findNumbersInLine(index)), [])
  .filter(entry => entry.adjacent.length);

const sumOfPartNumbers = allPartNumbers.reduce((acc, cur) => acc + parseInt(cur.number, 10), 0);
console.log(`Part 1: ${sumOfPartNumbers}`);

const arrayRange = (start, stop) => Array.from({ length: (stop - start) + 1 }, (value, index) => start + index);

const findGearsInLine = (lineNumber) => {
  const line = map[lineNumber];
  const foundGears = [];
  let foundGear = { adjacent: [] };

  [...line].forEach((char, index) => {
    if (char !== '*') return;
    foundGear.line = lineNumber;
    foundGear.position = index;
    /* before */
    foundGear.adjacent.push(...allPartNumbers.filter(part => part.line === lineNumber && part.end === index - 1));
    /* after */
    foundGear.adjacent.push(...allPartNumbers.filter(part => part.line === lineNumber && part.start === index + 1));
    /* above */
    foundGear.adjacent.push(...allPartNumbers.filter(part => part.line === lineNumber - 1 && arrayRange(part.start, part.end).some(numberIndex => [index - 1, index, index + 1].includes(numberIndex))));
    /* below */
    foundGear.adjacent.push(...allPartNumbers.filter(part => part.line === lineNumber + 1 && arrayRange(part.start, part.end).some(numberIndex => [index - 1, index, index + 1].includes(numberIndex))));

    foundGears.push(foundGear);
    foundGear = { adjacent: [] };
  });

  return foundGears;
};

const allGears = map.reduce((acc, _, index) => acc.concat(findGearsInLine(index)), []);
const sumOfValidGears = allGears
  .filter(gear => gear.adjacent.length === 2)
  .reduce((acc, cur) => [...acc, cur.adjacent[0].number * cur.adjacent[1].number], [])
  .reduce((acc, cur) => acc + cur, 0);

console.log(`Part 2: ${sumOfValidGears}`);
