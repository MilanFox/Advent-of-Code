import fs from 'node:fs';

const parser = /(?<nameA>\b[A-Z][a-z]+\b) would (?<sign>lose|gain) (?<amount>\d+) happiness units by sitting next to (?<nameB>\b[A-Z][a-z]+\b)/;

const preferences = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => parser.exec(data).groups);

const getGuestPreferences = (seatingPreferences) => {
  const guests = {};
  for (const { nameA, sign, amount, nameB } of seatingPreferences) {
    (guests[nameA] ??= {})[nameB] = sign === 'gain' ? Number(amount) : -Number(amount);
  }
  return guests;
};

const guests = getGuestPreferences(preferences);

const generateArrangements = (guests) => {
  const names = Object.keys(guests);
  const arrangements = [];
  const queue = [[[names.shift()], names]];

  while (queue.length) {
    const [currentOrder, remainingNames] = queue.shift();
    if (!remainingNames.length) arrangements.push(currentOrder);
    for (const name of remainingNames) {
      queue.push([[...currentOrder, name], remainingNames.filter(n => n !== name)]);
    }
  }

  return arrangements;
};

const arrangements = generateArrangements(guests);

const getHappinessFactor = (arrangement) => {
  return arrangement.reduce((acc, cur, i) => {
    const prevGuest = arrangement.at(i - 1) ?? arrangement.at(-1);
    const nextGuest = arrangement.at(i + 1) ?? arrangement.at(0);
    const cumulativeHappiness = guests[cur][prevGuest] + guests[cur][nextGuest];
    return acc + cumulativeHappiness;
  }, 0);
};

const maxHappiness = Math.max(...arrangements.map(getHappinessFactor));

console.log(`Part 1: ${maxHappiness}`);
