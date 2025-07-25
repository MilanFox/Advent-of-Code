import { readFileSync, writeFileSync } from 'node:fs';

const TileType = {
  VOID: ' ',
  CLAY: '█',
  WATER_FLOWING: '≋',
  WATER_SETTLED: '░',
  WATER_SOURCE: '◎',
};

class UndergroundScan {
  constructor(data) {
    const dataPoints = this.#parseData(data);

    this.#mapDimensions = dataPoints.reduce((acc, cur) => {
      acc.minX = Math.min(acc.minX, cur[0][0]);
      acc.maxX = Math.max(acc.maxX, cur[0][1]);
      acc.minY = Math.min(acc.minY, cur[1][0]);
      acc.maxY = Math.max(acc.maxY, cur[1][1]);
      return acc;
    }, ({
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity,
    }));

    this.#waterSource = { x: 500, y: this.#mapDimensions.minY - 1 };

    this.#map = Array.from({ length: this.#mapDimensions.maxY + 1 }, () => Array.from({ length: this.#mapDimensions.maxX + 2 }, () => TileType.VOID));

    this.#markClay(dataPoints);
    this.#map[this.#waterSource.y][this.#waterSource.x] = TileType.WATER_SOURCE;

    this.fillWithWater();
  }

  #map;
  #waterSource;
  #mapDimensions;

  #parseData(data) {
    const dataPointMatcher = /([xy])=(\d+(?:\.\.\d+)?), ([xy])=(\d+(?:\.\.\d+)?)/;

    return data.map(d => {
      const [_, ...match] = dataPointMatcher.exec(d);

      return [match.slice(0, 2), match.slice(2, 4)]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([_, measurement]) => {
          const isRange = measurement.includes('..');
          return isRange ? measurement.split('..').map(Number) : [Number(measurement), Number(measurement)];
        });
    });
  }

  #markClay(dataPoints) {
    dataPoints.forEach(([[startX, endX], [startY, endY]]) => {
      for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
          this.#map[y][x] = TileType.CLAY;
        }
      }
    });
  }

  renderMap() {
    writeFileSync(`visualization.txt`,
      this.#map
          .slice(this.#mapDimensions.minY - 1, this.#mapDimensions.maxY + 1)
          .map(line => line
            .join('')
            .slice(this.#mapDimensions.minX - 2, this.#mapDimensions.maxX + 2))
          .join('\n'), { flag: 'w+' },
    );
  }

  hasSettled(pos) {
    const isContained = (pos, dir) => {
      if (this.#map[pos.y][pos.x] === TileType.WATER_SETTLED) return true;

      const x = pos.x + dir;
      const nextTile = this.#map[pos.y][x];

      if (nextTile === TileType.CLAY) return true;
      if (nextTile === TileType.VOID) return false;
      return isContained({ x, y: pos.y }, dir);
    };

    const isFullyContained = isContained(pos, -1) && isContained(pos, 1);
    if (isFullyContained) this.#map[pos.y][pos.x] = TileType.WATER_SETTLED;

    return isFullyContained;
  };

  fillWithWater() {
    const fillFrom = ({ x, y }) => {
      this.#map[y][x] = TileType.WATER_FLOWING;

      if (y + 1 > this.#mapDimensions.maxY) return { finished: true };

      let shouldFinish = false;

      if (this.#map[y + 1][x] === TileType.VOID) {
        const { finished } = fillFrom({ x, y: y + 1 });
        if (finished) shouldFinish = true;
      }

      if (shouldFinish) return { finished: true };

      if (this.#map[y + 1][x] === TileType.CLAY ||
          this.#map[y + 1][x] === TileType.WATER_SETTLED ||
          (this.#map[y + 1][x] === TileType.WATER_FLOWING && this.hasSettled({ x, y: y + 1 }))) {
        if (this.#map[y][x - 1] === TileType.VOID) fillFrom({ x: x - 1, y });
        if (this.#map[y][x + 1] === TileType.VOID) fillFrom({ x: x + 1, y });
      }

      return { finished: shouldFinish };
    };

    fillFrom({ x: this.#waterSource.x, y: this.#waterSource.y + 1 });

    for (let y = this.#mapDimensions.minY; y < this.#mapDimensions.maxY; y++) {
      for (let x = this.#mapDimensions.minX; x < this.#mapDimensions.maxX; x++) {
        if (this.#map[y][x] === TileType.WATER_FLOWING) {
          const hasSettled = this.hasSettled({ x, y });
          if (hasSettled) this.#map[y][x] = TileType.WATER_SETTLED;
        }
      }
    }
  }

  get waterTiles() {
    return this.#map.flat().reduce((acc, cur) => {
      if (cur === TileType.WATER_SETTLED) acc.settled += 1;
      if (cur === TileType.WATER_FLOWING) acc.flowing += 1;
      return acc;
    }, { flowing: 0, settled: 0 });
  }
}

const inputData = readFileSync('input.txt', 'utf-8').trim().split('\n');

const undergroundScan = new UndergroundScan(inputData);

const { settled, flowing } = undergroundScan.waterTiles;

console.log(`Part 1: ${settled + flowing}`);
console.log(`Part 2: ${settled}`);

undergroundScan.renderMap(); // Written for debugging, left in for style points.
