import fs from 'fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => data.split('   ').map(Number));

const historianGroups = [0, 1].map(i => inputData.map(data => data[i]).toSorted((a, b) => a - b));
const totalDistance = inputData.reduce((acc, _, i) => acc + Math.abs(historianGroups[0][i] - historianGroups[1][i]), 0);
console.log(`Part 1: ${totalDistance}`);

const similarityScore = historianGroups[0].reduce((acc, cur) => acc + (cur * historianGroups[1].filter(e => e === cur).length), 0);
console.log(`Part 2: ${similarityScore}`);
