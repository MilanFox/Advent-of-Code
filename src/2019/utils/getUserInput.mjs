import * as readline from 'node:readline';

export async function getUserInput() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question('Input: ', answer => {
    rl.close();
    resolve(parseInt(answer));
  }));
}
