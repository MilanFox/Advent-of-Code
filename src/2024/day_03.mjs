import fs from 'fs';

const inputData = fs.readFileSync('input.txt', 'utf-8');

const multiplication = /mul\((\d+),(\d+)\)/g;
const anyNumber = /(\d+)/g;

const extract = (str, rgx) => [...str.matchAll(rgx)].map(match => match[0]);

const multiplyAll = (str) => extract(str, multiplication)
  .map(mult => extract(mult, anyNumber).map(Number))
  .reduce((acc, [a, b]) => acc + (a * b), 0);

console.log(`Part 1: ${multiplyAll(inputData)}`);

const enabledParts = inputData.split('do()').map(instr => instr.split('don\'t()')[0]).join('');

console.log(`Part 2: ${multiplyAll(enabledParts)}`);
