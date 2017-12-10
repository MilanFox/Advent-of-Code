import * as fs from 'node:fs';
import { Hash } from './utils/useKnotHash.mjs';

const inputData = fs.readFileSync('input.txt', 'utf-8').trim();

const hash1 = new Hash(inputData);
hash1.hash({ lengths: inputData.split(',').map(n => parseInt(n)), cycles: 1 });
console.log(`Part 1: ${hash1.checksum}`);

const hash2 = new Hash(inputData);
hash2.hash();
console.log(`Part 2: ${hash2.knotHash}`);
