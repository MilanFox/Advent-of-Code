import { IntCodeComputer } from './utils/useIntCodeInterpreter.mjs';
import fs from 'node:fs';

const memory = fs.readFileSync('input.txt', 'utf-8').trim().split(',').map(Number);

const vm1 = new IntCodeComputer(memory, { input: [1] });
await vm1.run();

console.log(`Part 1: ${vm1.lastOutput}`);

const vm2 = new IntCodeComputer(memory, { input: [2] });
await vm2.run();

console.log(`Part 2: ${vm2.lastOutput}`);
