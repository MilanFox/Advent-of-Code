import * as fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n');
const findDuplicateItem = (rucksacks) => rucksacks
  .map(rucksack => ([rucksack.substring(0, rucksack.length / 2), rucksack.substring(rucksack.length / 2)]))
  .map(([firstCompartment, secondCompartment]) => [...firstCompartment].find(item => [...secondCompartment].includes(item)));
const isLowercase = (char) => char === char.toLowerCase();
const getPriority = (id) => isLowercase(id) ? id.charCodeAt(0) - 96 : id.charCodeAt(0) - 38;
const sumOfPriorities = findDuplicateItem(inputData).map(item => getPriority(item)).reduce((acc, cur) => acc + cur, 0);

console.log(`Part 1: ${sumOfPriorities}`);

const groups = Array.from({ length: inputData.length / 3 }, (_, i) => inputData.slice(i * 3, i * 3 + 3));
const findCommonItem = (([elf1, elf2, elf3]) => [...elf1].find(item => [...elf2].includes(item) && [...elf3].includes(item)));
const sumOfGroupPriorities = groups.map(group => findCommonItem(group)).map(item => getPriority(item)).reduce((acc, cur) => acc + cur, 0);

console.log(`Part 2: ${sumOfGroupPriorities}`);
