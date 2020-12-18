import * as fs from 'node:fs';

const tokenize = (expression) => expression.split(/\s*/).map(n => parseInt(n) || n);

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(eq => tokenize(eq));

const solve = (tokens) => {
  while (tokens.length > 1) {
    if (!tokens.slice(0, 3).includes('(')) {
      tokens.splice(0, 3, eval(tokens.slice(0, 3).join('')));
    } else {
      const a = tokens.findIndex(token => token === '(');
      let b = a + 1;
      let depth = 1;
      while (depth) {
        if (tokens[b] === ')') depth -= 1;
        if (tokens[b] === '(') depth += 1;
        b += 1;
      }

      tokens.splice(a, b - a, solve(tokens.slice(a + 1, b - 1)));
    }

  }

  return tokens[0];
};

console.log(`Part 1: ${inputData.map(eq => solve(eq)).reduce((acc, cur) => acc + cur, 0)}`);
