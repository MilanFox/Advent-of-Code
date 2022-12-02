import * as fs from 'node:fs';

const playerGuide = { X: 'rock', Y: 'paper', Z: 'scissors' };
const opponentGuide = { A: 'rock', B: 'paper', C: 'scissors' };
const requirement = { X: 'lose', Y: 'draw', Z: 'win' };

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(round => {
    const [opponentHand, playerHand] = round.split(' ');
    return {
      player: playerGuide[playerHand],
      opponent: opponentGuide[opponentHand],
      requirement: requirement[playerHand],
    };
  });

const rules = {
  'rock': { winsAgainst: { paper: false, scissors: true }, score: 1, name: 'rock' },
  'paper': { winsAgainst: { rock: true, scissors: false }, score: 2, name: 'paper' },
  'scissors': { winsAgainst: { rock: false, paper: true }, score: 3, name: 'scissors' },
};

const getScore = (hands) => {
  let score = rules[hands.player].score;
  if (hands.player === hands.opponent) return score + 3;
  if (rules[hands.player].winsAgainst[hands.opponent]) return score + 6;
  return score;
};

let totalScore = inputData.reduce((total, cur) => total + getScore(cur), 0);
console.log(`Part 1: ${totalScore}`);

const getHand = (hands) => {
  if (hands.requirement === 'draw') return hands.opponent;
  if (hands.requirement === 'lose') return Object.values(rules).find(hand => hand.winsAgainst[hands.opponent] === false).name;
  return Object.values(rules).find(hand => hand.winsAgainst[hands.opponent]).name;
};

const round2 = inputData.map(round => ({ opponent: round.opponent, player: getHand(round) }));
totalScore = round2.reduce((total, cur) => total + getScore(cur), 0);
console.log(`Part 2: ${totalScore}`);
