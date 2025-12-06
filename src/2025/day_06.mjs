import { readFileSync } from 'node:fs';

const rows = readFileSync('input.txt', 'utf-8').trim().split('\n');
const type1data = rows.map(line => line.trim().split(/\s+/));
const operators = type1data.pop();

const dataCols = type1data[0].reduce((total, _, j) => {
  total.push(
    type1data.reduce((acc, cur) => {
      acc.values.push(cur[j]);
      return acc;
    }, { values: [], operator: operators[j] }),
  );
  return total;
}, []);

const calculate = ({ values, operator }) => values.reduce((acc, cur, i) => {
  if (i === 0) return acc;
  if (operator === '+') return acc + Number(cur);
  if (operator === '*') return acc * Number(cur);
}, Number(values[0]));

console.log(`Part 1: ${dataCols.reduce((acc, cur) => acc + calculate(cur), 0)}`);

const type2Data = Array
  .from({ length: rows.reduce((acc, cur) => Math.max(acc, cur.length), 0) }, (_, i) => rows.slice(0, -1).reduce((acc, row) => acc + (row[i] ?? ''), ''))
  .reduce((acc, cur) => {
    if (cur.match(/^\s+$/)) acc.push([]);
    else acc.at(-1).push(Number(cur));
    return acc;
  }, [[]])
  .map((values, i) => ({ values, operator: operators[i] }));

console.log(`Part 2: ${type2Data.reduce((acc, cur) => acc + calculate(cur), 0)}`);
