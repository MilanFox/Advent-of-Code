import * as fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split(',').map(n => parseInt(n));

const play = ({ gameLength }) => {
  const memo = inputData.reduce((acc, cur, i) => ({ ...acc, [cur]: [i + 1] }), {});
  let lastNumber = inputData.at(-1);

  for (let i = inputData.length + 1; i <= gameLength; i++) {
    let newNumber = 0;
    if (memo[lastNumber].length > 1) newNumber = memo[lastNumber].at(-1) - memo[lastNumber].at(-2);
    if (!memo[newNumber]) memo[newNumber] = [];
    memo[newNumber].push(i);
    lastNumber = newNumber;
  }

  return lastNumber;
};

console.log(play({ gameLength: 2020 }));
