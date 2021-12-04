import * as fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n\n').map(data => data);

const [_drawnNumbers, ..._bingoBoards] = inputData;
const drawnNumbers = _drawnNumbers.split(',').map(n => parseInt(n));

class BingoBoard {
  constructor(data) {
    this.board = data.split('\n').map(row => row.trim().split(/\s+/).map(n => parseInt(n)));
  }

  get isAnyRowFilled() {
    return this.board.some(row => row.every(cell => cell === 'X'));
  }

  get isAnyColumFilled() {
    return Array
      .from({ length: this.board[0].length }, (_, i) => this.board.map((row) => row[i]))
      .some(row => row.every(cell => cell === 'X'));
  }

  get unmarkedNumbers() {
    return this.board.flatMap(row => row.filter(cell => typeof cell === 'number'));
  }

  get sumOfUnmarkedNumbers() {
    return this.unmarkedNumbers.reduce((acc, cur) => acc + cur, 0);
  }

  tryDaubOffNumber(number) {
    this.board.forEach(row => {
      const i = row.findIndex(cell => cell === number);
      if (i >= 0) row[i] = 'X';
    });
  };
}

const bingoBoards = _bingoBoards.map(data => new BingoBoard(data));

const findWinner = () => {
  for (let number of drawnNumbers) {
    bingoBoards.forEach(board => board.tryDaubOffNumber(number));
    const winningBoards = bingoBoards.filter(board => board.isAnyRowFilled || board.isAnyColumFilled);
    if (winningBoards.length) return { winningBoard: winningBoards[0], lastDrawnNumber: number };
  }
};

const { lastDrawnNumber, winningBoard } = findWinner();
console.log(`Part 1: ${lastDrawnNumber * winningBoard.sumOfUnmarkedNumbers}`);

const findLoser = () => {
  let losingBoard;
  for (let number of drawnNumbers) {
    bingoBoards.forEach(board => board.tryDaubOffNumber(number));
    const losingBoards = bingoBoards.filter(board => !board.isAnyRowFilled && !board.isAnyColumFilled);
    if (losingBoards.length === 1) losingBoard = losingBoards[0];
    if (!losingBoards.length) return { losingBoard, lastDrawnNumber: number };
  }
};

const { lastDrawnNumber: lastDawnForLoser, losingBoard } = findLoser();
console.log(`Part 2: ${losingBoard.sumOfUnmarkedNumbers * lastDawnForLoser}`);
