import * as fs from 'node:fs';
import { IntCodeComputer } from './utils/useIntCodeInterpreter.mjs';

const memory = fs.readFileSync('input.txt', 'utf-8').trim().split(',').map(n => parseInt(n));

const computer = new IntCodeComputer(memory);
await computer.run();

console.log(`Part 1&2: ${computer.lastOutput}`);
