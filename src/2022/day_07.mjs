import * as fs from 'node:fs';

const dataType = Object.freeze({ FILE: 'file', DIR: 'dir' });
const commandType = Object.freeze({ CHANGE_DIR: 'cd', LIST: 'ls' });

const dirIndex = [];

class Command {
  constructor(log) {
    const [input, ...output] = log.trim().split('\n');
    const [instruction, target] = input.split(' ');
    this.instruction = instruction;

    if (this.instruction === commandType.CHANGE_DIR) this.targetDir = target;
    if (this.instruction === commandType.LIST) this.list = output.map(el => {
      const [a, b] = el.split(' ');
      if (a === dataType.DIR) return { type: dataType.DIR, name: b };
      return { type: dataType.FILE, name: b, size: parseInt(a) };
    });
  }
}

class Directory {
  constructor({ type, name, parent }) {
    this.type = type;
    this.name = name;
    this.parent = parent;
    this.children = [];
  }

  get size() {
    return this.children.reduce((acc, cur) => acc + cur.size, 0);
  }

  appendChildren(children) {
    children.forEach(child => {
      if (child.type === dataType.FILE) this.children.push(new File(child));
      if (child.type === dataType.DIR) {
        this.children.push(new Directory({ ...child, parent: this }));
        dirIndex.push(this.children.at(-1));
      }
    });
  };
}

class File {
  constructor({ type, name, size }) {
    this.type = type;
    this.name = name;
    this.size = size;
  }
}

class FileSystem {
  constructor() {
    this.currentDir = new Directory({ name: 'root', parent: null });
    this.currentDir.appendChildren([new Directory({ name: '/', parent: this.currentDir, type: dataType.DIR })]);
    this.root = this.currentDir.children[0];
  }

  execute(cmd) {
    if (cmd.instruction === commandType.LIST) this.currentDir.appendChildren(cmd.list);
    if (cmd.instruction === commandType.CHANGE_DIR) {
      if (cmd.targetDir === '..') this.currentDir = this.currentDir.parent; else this.currentDir = this.currentDir.children.find(child => child.name === cmd.targetDir);
    }
  }
}

const fileSystem = new FileSystem();
const commands = fs.readFileSync('input.txt', 'utf-8').split('$').filter(Boolean).map(log => new Command(log));
commands.forEach(cmd => fileSystem.execute(cmd));

console.log(`Part 1: ${dirIndex.filter(dir => dir.size <= 100000).reduce((acc, cur) => acc + cur.size, 0)}`);
console.log(`Part 2: ${dirIndex.toSorted((a, b) => a.size - b.size).find(dir => dir.size >= (30_000_000 - (70_000_000 - fileSystem.root.size))).size}`);



