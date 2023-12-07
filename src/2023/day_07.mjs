import * as fs from 'node:fs';

const cardValues = [...'_23456789TJQKA'].reduce((acc, face, index) => ({ ...acc, [face]: index }), {});

const getStackCounts = (cards) => [...cards].reduce((acc, cur) => ({ ...acc, [cur]: (acc[cur] || 0) + 1 }), {});

const getHandValue = (hand, useJokers = false) => {
  const numberOfJokers = useJokers ? [...hand].filter(card => card === '_').length : 0;
  const { _, ...cardsWithoutJokers } = getStackCounts(hand);
  const [highestStack, secondHighestStack] = Object.values(cardsWithoutJokers).toSorted((a, b) => b - a);
  if (highestStack + numberOfJokers === 1) return 0;
  if (highestStack + numberOfJokers === 2) return secondHighestStack !== 2 ? 1 : 2;
  if (highestStack + numberOfJokers === 3) return secondHighestStack !== 2 ? 3 : 4;
  if (highestStack + numberOfJokers === 4) return 5;
  return 6;
};

const calculateData = line => {
  let [hand, bid] = line.split(' ');
  const handWithJokers = hand.replaceAll('J', '_');
  const withoutJokers = { cards: hand, value: getHandValue(hand) };
  const withJokers = { cards: handWithJokers, value: getHandValue(handWithJokers, true) };
  return { withoutJokers, withJokers, bid: parseInt(bid) };
};

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(calculateData);

const sortData = (inputData, useJokers = false) => inputData.toSorted((a, b) => {
  const targetSet = useJokers ? 'withJokers' : 'withoutJokers';
  const getValue = (item) => item[targetSet].value;
  const getCards = (item) => item[targetSet].cards;
  if (getValue(a) !== getValue(b)) return getValue(a) - getValue(b);
  for (let i = 0; i < 5; i++) {
    if (getCards(a)[i] !== getCards(b)[i]) return cardValues[getCards(a)[i]] - cardValues[getCards(b)[i]];
  }
  return 0;
});

const getTotalWinnings = (acc, cur, i) => acc + ((i + 1) * cur.bid);

console.log(`Part 1: ${sortData(inputData).reduce(getTotalWinnings, 0)}`);
console.log(`Part 2: ${sortData(inputData, true).reduce(getTotalWinnings, 0)}`);
