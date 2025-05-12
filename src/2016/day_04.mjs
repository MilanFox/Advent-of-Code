import { readFileSync } from 'node:fs';

class Room {
  constructor(hash) {
    const [tempData, commonLetters] = hash.slice(0, -1).split('[');
    const roomData = tempData.split('-');

    this.sectorID = Number(roomData.pop());
    this.encryptedName = roomData;
    this.mostCommonLetters = commonLetters;
  }

  get letterCount() {
    const count = {};
    this.encryptedName.flatMap(block => block.split('')).forEach(el => count[el] = (count[el] || 0) + 1);

    return Object
      .entries(count)
      .sort((a, b) => a[1] === b[1] ? a[0].localeCompare(b[0]) : b[1] - a[1]);
  }

  get isReal() {
    const realMostCommonLetters = this.letterCount.slice(0, 5).map(([char]) => char).join('');
    return realMostCommonLetters === this.mostCommonLetters;
  }
}

const rooms = readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new Room(data));

const realRooms = rooms.filter(room => room.isReal);
console.log(`Part 1: ${realRooms.map(room => room.sectorID).reduce((acc, cur) => acc + cur, 0)}`);
