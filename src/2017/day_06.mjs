import * as fs from 'node:fs';

class Memory {
  constructor(startingBlocks) {
    this.banks = Array.from({ length: startingBlocks.length }, (_, i) => new MemoryBank(i, startingBlocks[i]));
  }

  get fullestBank() {
    return this.banks.toSorted((a, b) => b.blocks - a.blocks).at(0);
  }

  get checkSum() {
    return this.banks.map(({ blocks }) => blocks).join('|');
  }

  reallocateMemory() {
    const fullestBank = this.fullestBank;
    let { blocks: unallocatedBlocks, id: currentPointer } = fullestBank;
    fullestBank.empty();
    while (unallocatedBlocks) {
      currentPointer = (currentPointer + 1) % this.banks.length;
      this.banks[currentPointer].addBlock();
      unallocatedBlocks -= 1;
    }
  }
}

class MemoryBank {
  constructor(id, blocks) {
    this.id = id;
    this.blocks = blocks ?? 0;
  }

  empty() {
    this.blocks = 0;
  }

  addBlock() {
    this.blocks += 1;
  }
}

const memory = new Memory(fs.readFileSync('input.txt', 'utf-8').trim().split('\t').map(n => parseInt(n)));

const findLoop = () => {
  const memo = new Set();
  let cycles = 0;
  while (true) {
    if (memo.has(memory.checkSum)) return {
      cycles,
      loopSize: memo.size - [...memo].findIndex(el => el === memory.checkSum),
    };
    memo.add(memory.checkSum);
    cycles += 1;
    memory.reallocateMemory();
  }
};

const loop = findLoop();

console.log(`Part 1: ${loop.cycles}`);
console.log(`Part 2: ${loop.loopSize}`);
