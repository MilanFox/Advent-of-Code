import * as fs from 'node:fs';

const captcha = fs.readFileSync('input.txt', 'utf-8').trim().split('').map(n => parseInt(n));

const matchingDigits1 = captcha.filter((digit, i) => digit === captcha.at(((i + 1) % captcha.length)));
console.log(`Part 1: ${matchingDigits1.reduce((acc, cur) => acc + cur, 0)}`);

const matchingDigits2 = captcha.filter((digit, i) => digit === captcha.at(((captcha.length / 2) + i) % captcha.length));
console.log(`Part 2: ${matchingDigits2.reduce((acc, cur) => acc + cur, 0)}`);
