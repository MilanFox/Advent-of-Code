import { readFileSync } from 'node:fs';
import crypto from 'crypto';

const id = readFileSync('input.txt', 'utf-8').trim();

function* generatePassword() {
  let i = 0;
  while (true) {
    const hash = crypto.createHash('md5').update(`${id}${i}`).digest('hex');
    if (hash.startsWith('0'.repeat(5))) yield hash;
    i++;
  }
}

const getPassword = () => {
  const passwordGenerator = generatePassword();
  return Array.from({ length: 8 }, () => passwordGenerator.next().value[5]).join('');
};

console.log(`Part 1: ${getPassword()}`);

const getStrongPassword = () => {
  const passwordGenerator = generatePassword();
  const password = Array.from({ length: 8 });

  while (true) {
    const nextHash = passwordGenerator.next().value;
    const pos = Number(nextHash[5]);
    if (!Number.isNaN(pos) && pos <= 7 && password[pos] === undefined) {
      password[pos] = nextHash[6];
      if (password.every(el => el !== undefined)) break;
    }
  }

  return password.join('');
};

console.log(`Part 2: ${getStrongPassword()}`);
