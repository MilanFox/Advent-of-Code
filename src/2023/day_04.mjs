import * as fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n');

const parseTickets = line => {
  const lineData = line.split(' | ');
  const cardData = lineData.at(0).split(': ');
  const draw = parseInt(cardData.at(0).split(' ').at(-1));
  const drawnNumbers = cardData[1].split(' ').filter(num => num !== '').map(num => parseInt(num));
  const winningNumbers = lineData[1].split(' ').filter(num => num !== '').map(num => parseInt(num));
  const matchingNumbers = drawnNumbers.filter(num => winningNumbers.includes(num));
  const matches = matchingNumbers.length;
  const points = matches ? 2 ** (matches - 1) : 0;
  return { draw, points, matches, worth: 1 };
};

const cards = inputData.reverse().map(parseTickets);

console.log(`Part 1: ${cards.reduce((acc, cur) => acc + cur.points, 0)}`);

cards.forEach((card, index) => {
  for (let i = 1; i <= card.matches; i++) {
    if (!cards[index - i]) break;
    card.worth += cards[index - i].worth;
  }
});

console.log(`Part 2: ${cards.reduce((acc, cur) => acc + cur.worth, 0)}`);
