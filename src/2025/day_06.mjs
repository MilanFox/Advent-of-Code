import { readFileSync } from 'node:fs';

const rows = readFileSync('input.txt', 'utf-8').trim().split('\n');
const type1data = rows.map(line => line.trim().split(/\s+/));
const operators = type1data.pop();

const dataCols = type1data[0].map((_, j) => ({
  values: type1data.map(row => row[j]),
  operator: operators[j],
}));

const calculate = ({ values, operator }) => values
  .slice(1)
  .reduce((acc, cur) => {
    if (operator === '+') return acc + Number(cur);
    if (operator === '*') return acc * Number(cur);
  }, Number(values[0]));

console.log(`Part 1: ${dataCols.reduce((acc, cur) => acc + calculate(cur), 0)}`);

const type2Data = Array
  .from({ length: Math.max(...rows.map(r => r.length)) }, (_, i) => rows.slice(0, -1).map(r => r[i] ?? '').join(''))
  .reduce((acc, cur) => acc.concat(/^\s+$/.test(cur) ? [[]] : [[Number(cur)]].map(v => acc.pop()?.concat(v) ?? v)), [])
  .map((values, i) => ({ values, operator: operators[i] }));

console.log(`Part 2: ${type2Data.reduce((acc, cur) => acc + calculate(cur), 0)}`);
