import fs from 'node:fs';

const instructions = fs.readFileSync('input.txt', 'utf-8').trim().split('\n');

const binaryLights = Array.from({ length: 1000 }, () => Array(1000).fill(false));
const dimmableLights = Array.from({ length: 1000 }, () => Array(1000).fill(0));

instructions.forEach(instr => {
  const [_, cmd, start, end] = (/(\w+)\s([\d,]+)\sthrough\s([\d,]+)/g).exec(instr);
  const [xStart, yStart] = start.split(',').map(Number);
  const [xEnd, yEnd] = end.split(',').map(Number);

  for (let y = yStart; y <= yEnd; y++) {
    for (let x = xStart; x <= xEnd; x++) {
      switch (cmd) {
        case 'off':
          binaryLights[y][x] = false;
          dimmableLights[y][x] = Math.max(0, dimmableLights[y][x] - 1);
          break;
        case 'on':
          binaryLights[y][x] = true;
          dimmableLights[y][x] += 1;
          break;
        case 'toggle':
          binaryLights[y][x] = !binaryLights[y][x];
          dimmableLights[y][x] += 2;
          break;
      }
    }
  }
});

const numberOfActiveLamps = binaryLights.flat().filter(Boolean).length;
console.log(`Part 1: ${numberOfActiveLamps}`);

const totalBrightness = dimmableLights.flat().reduce((acc, cur) => acc + cur, 0);
console.log(`Part 2: ${totalBrightness}`);
