import * as fs from 'node:fs';

const inputFile = fs.readFileSync('input.txt', 'utf-8');

const maxPossibleCubes = { red: 12, green: 13, blue: 14 };

const gameData = inputFile
  .trim()
  .split('\n')
  .filter(Boolean)
  .reduce((acc, line) => {
    const lineData = line.split(': ');
    const game = parseInt(lineData[0].split(' ')[1]);
    const results = lineData[1].split('; ');

    const draws = results
      .reduce((acc, singleDraw) => {
        const drawData = singleDraw
          .split(', ')
          .reduce((acc, cur) => {
            const [amount, color] = cur.split(' ');
            return { ...acc, [color.split(',')[0]]: parseInt(amount) };
          }, {});
        return [...acc, drawData];
      }, []);
    return [...acc, { game, draws }];
  }, []);

const legalGames = gameData.filter(singleGame => {
  return singleGame.draws.every(draw => {
    const isRedValid = !draw.red || draw.red <= maxPossibleCubes.red;
    const isGreenValid = !draw.green || draw.green <= maxPossibleCubes.green;
    const isBlueValid = !draw.blue || draw.blue <= maxPossibleCubes.blue;
    return isRedValid && isGreenValid && isBlueValid;
  });
});

console.log('Part 1:', legalGames.reduce((acc, cur) => acc + cur.game, 0));

const gamePower = gameData.reduce((acc, singleGame) => {
  const power = singleGame.draws.reduce((acc, cur) => {
    return {
      red: Math.max(acc.red, cur.red || 1),
      green: Math.max(acc.green, cur.green || 1),
      blue: Math.max(acc.blue, cur.blue || 1),
    };
  }, { red: 1, green: 1, blue: 1 });
  return acc + (power.red * power.blue * power.green);
}, 0);

console.log('Part 2:', gamePower);
