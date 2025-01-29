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

    const emptyBuckets = buckets.filter(({ id }) => !(usedBuckets.some(bucket => bucket.id === id)));

    for (const bucket of emptyBuckets) {
      const newBuckets = [...usedBuckets, bucket];
      const hash = getHash(newBuckets);
      if (visited.has(hash)) continue;
      visited.add(hash);
      stack.push([currentVolume + bucket.volume, newBuckets]);
    }
  }

  return combinations.size;
};

console.log(`Part 1: ${getCombinations(150)}`);
