import { readFileSync } from 'node:fs';

const transmission = readFileSync('input.txt', 'utf-8')
  .trim()
  .split('')
  .map(n => parseInt(n, 16).toString(2).padStart(4, '0'))
  .join('');

class Packet {
  #value;

  constructor(data) {
    this.version = Number(`0b${data.slice(0, 3)}`);
    this.type = Number(`0b${data.slice(3, 6)}`);
    this.content = [];
    this.length = 0;

    if (this.type === 4) {
      let i = 6;
      while (true) {
        if (data.slice(i).length < 5) {
          this.length = 3 + 3 + (5 * this.content.length) + data.slice(i).length;
          break;
        }

        const continueReading = data[i] === '1';
        this.content.push(data.slice(i + 1, i + 5));

        if (!continueReading) {
          this.length = 3 + 3 + (5 * this.content.length);
          break;
        }

        i += 5;
      }
    } else {
      const lengthTypeID = data[6];

      if (lengthTypeID === '0') {
        const contentLength = Number(`0b${data.slice(7, 22)}`);
        this.length = 3 + 3 + 1 + 15 + contentLength;

        let consumed = 0;

        while (consumed < contentLength) {
          const nextPacket = new Packet(data.slice(22 + consumed, 22 + contentLength));
          this.content.push(nextPacket);
          consumed += nextPacket.length;
        }
      } else {
        this.length = 3 + 3 + 1 + 11;
        let numberOfContentPackets = Number(`0b${data.slice(7, 18)}`);
        let rest = data.length - this.length;

        while (numberOfContentPackets) {
          const nextPacket = new Packet(data.slice(data.length - rest, data.length));
          this.length += nextPacket.length;
          rest -= nextPacket.length;
          numberOfContentPackets -= 1;
          this.content.push(nextPacket);
        }
      }
    }
  }

  get value() {
    if (this.#value !== undefined) return this.#value;

    if (this.type === 4) {
      this.#value = Number(`0b${this.content.join('')}`);
    }

    return this.#value;
  }

  get checksum() {
    if (this.content.every(el => typeof el === 'string')) return this.version;
    return this.content.reduce((acc, cur) => acc + cur.checksum, 0) + this.version;
  }
}

const BITSPacket = new Packet(transmission);

console.log(`Part 1: ${BITSPacket.checksum}`);
