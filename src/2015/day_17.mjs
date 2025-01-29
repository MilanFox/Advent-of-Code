import fs from 'node:fs';

class Bucket {
  constructor(volume, id) {
    this.id = id;
    this.volume = Number(volume);
  }
}

const buckets = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map((data, i) => new Bucket(data, i));

const getHash = (buckets) => buckets.toSorted((a, b) => b.id - a.id).map(({ id }) => id).join('-');

const getCombinations = (targetVolume) => {
  const stack = [[0, []]];
  const visited = new Set();
  let combinations = new Set();

  while (stack.length) {
    const [currentVolume, usedBuckets] = stack.pop();

    if (currentVolume === targetVolume) {
      combinations.add(getHash(usedBuckets));
      continue;
    }

    if (currentVolume > targetVolume) continue;

    const emptyBuckets = buckets.filter(({ id }) => !(usedBuckets.some(bucket => bucket.id === id)));

    for (const bucket of emptyBuckets) {
      const newBuckets = [...usedBuckets, bucket];
      const hash = getHash(newBuckets);
      if (visited.has(hash)) continue;
      visited.add(hash);
      stack.push([currentVolume + bucket.volume, newBuckets]);
    }
  }

  const neededBuckets = [...combinations].map(combination => combination.split('-').length);
  const minimalNeededBuckets = Math.min(...neededBuckets);

  return [combinations.size, neededBuckets.filter(needed => needed === minimalNeededBuckets).length];
};

const [combinations, combinationsWithMinimalBuckets] = getCombinations(150);

console.log(`Part 1: ${combinations}`);
console.log(`Part 2: ${combinationsWithMinimalBuckets}`);
