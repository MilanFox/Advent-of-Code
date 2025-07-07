import * as readline from 'node:readline';

export async function getUserInput({ isAscii }) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question('> ', answer => {
    rl.close();
    if (isAscii) resolve([...answer, '\n'].map(c => c.charCodeAt(0)));
    else resolve(parseInt(answer));
  }));
}
