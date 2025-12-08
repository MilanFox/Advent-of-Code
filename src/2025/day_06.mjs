import { readFileSync } from 'node:fs';

const inputLines = readFileSync('input.txt', 'utf-8').trim().split('\n');
const gridRows = inputLines.map(line => line.trim().split(/\s+/));
const operators = gridRows.pop();

const columns = gridRows[0]
  .map((_, j) => ({ values: gridRows.map(row => row[j]), operator: operators[j] }));

const toResult = (total, { values, operator }) => total + values
  .slice(1)
  .reduce((acc, cur) => operator === '+' ? acc + Number(cur) : acc * Number(cur), Number(values[0]));

console.log(`Part 1: ${columns.reduce(toResult, 0)}`);

const decodedColumns = Array
  .from({ length: Math.max(...inputLines.map(r => r.length)) }, (_, i) => inputLines.slice(0, -1).map(r => r[i] ?? '').join(''))
  .reduce((acc, cur) => acc.concat(/^\s+$/.test(cur) ? [[]] : [[Number(cur)]].map(v => acc.pop()?.concat(v) ?? v)), [])
  .map((values, i) => ({ values, operator: operators[i] }));

console.log(`Part 2: ${decodedColumns.reduce(toResult, 0)}`);
