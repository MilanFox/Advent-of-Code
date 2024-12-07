import fs from 'fs';

const multiplication = /mul\((\d+),(\d+)\)/g;
const extract = (str, rgx) => [...str.matchAll(rgx)].map(match => match.slice(1).map(Number));
const multiplyAll = (str) => extract(str, multiplication).reduce((acc, [a, b]) => acc + (a * b), 0);

const inputData = fs.readFileSync('input.txt', 'utf-8');
console.log(`Part 1: ${multiplyAll(inputData)}`);

const enabledParts = inputData.split('do()').map(instr => instr.split('don\'t()')[0]).join('');
console.log(`Part 2: ${multiplyAll(enabledParts)}`);
