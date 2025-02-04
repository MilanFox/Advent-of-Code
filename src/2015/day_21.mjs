import fs from 'node:fs';

const boss = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(data => data.match(/\d+/g)).map(Number);

const shop = {
  weapons: [[8, 4, 0], [10, 5, 0], [25, 6, 0], [40, 7, 0], [74, 8, 0]],
  armor: [[0, 0, 0], [13, 0, 1], [31, 0, 2], [53, 0, 3], [75, 0, 4], [102, 0, 5]],
  rings: [[0, 0, 0], [0, 0, 0], [25, 1, 0], [50, 2, 0], [100, 3, 0], [20, 0, 1], [40, 0, 2], [80, 0, 3]],
};

const equipmentSets = [];

for (const weapon of shop.weapons) {
  for (const armor of shop.armor) {
    for (let ring1 = 0; ring1 < shop.rings.length; ring1++) {
      for (let ring2 = ring1 + 1; ring2 < shop.rings.length; ring2++) {
        const selection = [weapon, armor, shop.rings[ring1], shop.rings[ring2]];
        const modifier = selection[0].map((_, i) => selection.reduce((sum, arr) => sum + arr[i], 0));
        equipmentSets.push(modifier);
      }
    }
  }
}

const isWinningSet = (equipmentStats) => {
  const [bossHitPoints, bossDamage, bossArmor] = boss;
  const playerHitPoints = 100;
  const [_, playerDamage, playerArmor] = equipmentStats;
  const neededPlayerHits = Math.ceil(bossHitPoints / Math.max((playerDamage - bossArmor), 1));
  const neededBossHits = Math.ceil(playerHitPoints / Math.max((bossDamage - playerArmor), 1));
  return neededPlayerHits <= neededBossHits;
};

const cheapestWinningSet = equipmentSets.filter(isWinningSet).sort(([a], [b]) => a - b).at(0);
console.log(`Part 1: ${cheapestWinningSet.at(0)}`);

const mostExpensiveLosingSet = equipmentSets.filter(set => !isWinningSet(set)).sort(([a], [b]) => b - a).at(0);
console.log(`Part 2: ${mostExpensiveLosingSet.at(0)}`);
