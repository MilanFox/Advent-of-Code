import { readFileSync } from 'node:fs';
import crypto from 'crypto';

const id = readFileSync('input.txt', 'utf-8').trim();

// Progress Bar - Just for flair, since this is puzzle a very expensive calculation by design
const CLI = {
  updateLine: (text) => {
    process.stdout.write(text);
  },
  clearLine: () => {
    process.stdout.clearLine?.(0);
    process.stdout.cursorTo?.(0);
  },
  hideCursor: () => {
    process.stdout.write('\x1B[?25l');
  },
  showCursor: () => {
    process.stdout.write('\x1B[?25h');
  },
};

function* generatePassword() {
  let i = 0;
  while (true) {
    const hash = crypto.createHash('md5').update(`${id}${i}`).digest('hex');
    if (hash.startsWith('0'.repeat(5))) yield hash;
    i++;
  }
}

CLI.hideCursor();

const getPassword = () => {
  const passwordGenerator = generatePassword();

  const password = Array.from({ length: 8 }, (_, i) => {
    CLI.updateLine(`\rPart 1: ${'█'.repeat(i)}${'░'.repeat(8 - i)}`);
    return passwordGenerator.next().value[5];
  }).join('');

  CLI.clearLine();
  return password;
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
      const i = password.filter(el => el !== undefined).length;
      CLI.updateLine(`\rPart 2: ${'█'.repeat(i)}${'░'.repeat(8 - i)}`);
      if (password.every(el => el !== undefined)) break;
    }
  }

  CLI.clearLine();
  return password.join('');
};

console.log(`Part 2: ${getStrongPassword()}`);

CLI.showCursor();
