import fs from 'fs';

const multiplication = /mul\((\d+),(\d+)\)/g;
const extractMultNumbers = (str) => [...str.matchAll(multiplication)].map(match => match.slice(1).map(Number));
const multiplyAll = (str) => extractMultNumbers(str).reduce((acc, [a, b]) => acc + (a * b), 0);

const inputData = fs.readFileSync('input.txt', 'utf-8');
console.log(`Part 1: ${multiplyAll(inputData)}`);

const enabledParts = inputData.split('do()').map(instr => instr.split('don\'t()')[0]).join('');
console.log(`Part 2: ${multiplyAll(enabledParts)}`);
