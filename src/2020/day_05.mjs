import * as fs from 'node:fs';

class Airplane {
  constructor(boardingPasses) {
    this.boardingPasses = boardingPasses;
    this.seats = Array.from({ length: 128 }, () => Array.from({ length: 8 }));

    boardingPasses.forEach((boardingPass) => this.seats[boardingPass.row][boardingPass.col] = boardingPass);
  }

  getSeatID(boardingPass) {
    return boardingPass.row * 8 + boardingPass.col;
  }

  get allIDs() {
    return this.boardingPasses.map(boardingPass => this.getSeatID(boardingPass)).toSorted((a, b) => b - a);
  }

  get emptySeat() {
    for (let row = 1; row < this.seats.length; row++) {
      for (let col = 0; col < this.seats[row].length; col++) {
        if (this.seats[row][col] !== undefined) continue;
        const ID = this.getSeatID({ row, col });
        if (this.allIDs.includes(ID + 1) && this.allIDs.includes(ID - 1)) return ID;
      }
    }
  }
}

class BoardingPass {
  constructor(data) {
    const toDec = (input, zeroChar, oneChar) => parseInt(input.replaceAll(zeroChar, '0').replaceAll(oneChar, '1'), 2);
    this.row = toDec(data.slice(0, 7), 'F', 'B');
    this.col = toDec(data.slice(7), 'L', 'R');
  }
}

const airplane = new Airplane(fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new BoardingPass(data)));

console.log(`Part 1: ${airplane.allIDs.at(0)}`);
console.log(`Part 2: ${airplane.emptySeat}`);
