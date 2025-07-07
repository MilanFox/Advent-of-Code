import { IntCodeComputer } from './utils/useIntCodeInterpreter.mjs';
import fs from 'node:fs';

const memory = fs.readFileSync('input.txt', 'utf-8').trim().split(',').map(Number);

const vm = new IntCodeComputer(memory, { input: [1] });
await vm.run();

console.log(`Part 1: ${vm.lastOutput}`);
