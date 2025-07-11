import { readFileSync } from 'node:fs';

class Tree {
  constructor(metadata) {
    const addNode = (metadata) => {
      const numberOfChildNodes = metadata.shift();
      const numberOfMetadataEntries = metadata.shift();
      const children = Array.from({ length: numberOfChildNodes }, () => addNode(metadata));
      const metadataEntries = metadata.splice(0, numberOfMetadataEntries);
      return new TreeNode(metadataEntries, children);
    };
    this.rootNode = addNode(metadata);
  }
}

class TreeNode {
  constructor(metadata, children) {
    this.metadata = metadata;
    this.children = children;
  }

  get checksum() {
    return this.metadata.reduce((acc, cur) => acc + cur, 0) + this.children.reduce((acc, cur) => acc + cur.checksum, 0);
  }

  get value() {
    if (!this.children.length) return this.metadata.reduce((acc, cur) => acc + cur, 0);
    else return this.metadata.reduce((acc, i) => acc + (this.children[i - 1]?.value || 0), 0);
  }
}

const metadata = readFileSync('input.txt', 'utf-8').trim().split(' ').map(Number);
const navigationSystem = new Tree(metadata);

console.log(`Part 1: ${navigationSystem.rootNode.checksum}`);
console.log(`Part 2: ${navigationSystem.rootNode.value}`);
