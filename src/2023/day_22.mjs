import * as fs from 'node:fs';

class Tower {
  constructor(x, y, z) {
    this.data = Array.from({ length: z }, () => Array.from({ length: y }, () => Array.from({ length: x }, () => ' ')));
  }

  get visualisation() {
    return this.data.toReversed();
  }

  get frontView() {
    return this.data.map(slice => {
      const view = Array(slice[0].length).fill(' ');
      for (let y = 0; y < slice.length; y++) {
        for (let x = 0; x < slice[0].length; x++) {
          if (view[x] !== ' ') continue;
          if (slice[y][x] === ' ') continue;
          view[x] = slice[y][x];
        }
      }
      return view;
    }).toReversed();
  };

  get sideView() {
    return this.data.map(slice => {
      const view = Array(slice[0].length).fill(' ');
      for (let y = 0; y < slice.length; y++) {
        for (let x = 0; x < slice[0].length; x++) {
          if (view[y] !== ' ') continue;
          if (slice[y][x] === ' ') continue;
          view[y] = slice[y][x];
        }
      }
      return view;
    }).toReversed();
  }

  populate(bricks) {
    this.data.forEach(z => {
      z.forEach(y => {
        y.fill(' ');
      });
    });

    bricks.forEach(brick => {
      this.data[0].forEach(y => y.fill('-'));

      for (let i = brick.start.x; i <= brick.end.x; i++) {
        this.data[brick.start.z][brick.start.y][i] = '#';
      }

      for (let i = brick.start.y; i <= brick.end.y; i++) {
        this.data[brick.start.z][i][brick.start.x] = '#';
      }

      for (let i = brick.start.z; i <= brick.end.z; i++) {
        this.data[i][brick.start.y][brick.start.x] = '#';
      }
    });
  }
}

class Brick {
  constructor(snapshot, index) {
    this.snapshot = snapshot;
    this.index = index;
    this.parse();
    this.supports = new Set;
    this.canBeDesintegrated = false;
  }

  parse() {
    const [start, end] = this.snapshot
      .split('~')
      .map(coords => coords.split(','))
      .map(coords => ({
        x: parseInt(coords[0], 10), y: parseInt(coords[1], 10), z: parseInt(coords[2], 10),
      }));

    this.start = start;
    this.end = end;
  }

  findHeadroom(tower) {
    let minHeadroomX = Infinity;
    let minHeadroomY = Infinity;

    for (let x = this.start.x; x <= this.end.x; x++) {
      for (let z = this.start.z - 1; z >= 0; z--) {
        if (this.start.z - z > minHeadroomX) break;
        if (tower.data[z][this.start.y][x] !== ' ') {
          minHeadroomX = Math.min(this.start.z - z - 1, minHeadroomX);
        }
      }
    }

    for (let y = this.start.y; y <= this.end.y; y++) {
      for (let z = this.start.z - 1; z >= 0; z--) {
        if (this.start.z - z > minHeadroomY) break;
        if (tower.data[z][y][this.start.x] !== ' ') {
          minHeadroomY = Math.min(this.start.z - z - 1, minHeadroomY);
        }
      }
    }

    return Math.min(minHeadroomX, minHeadroomY);
  }

  moveDown(levels) {
    this.start.z -= levels;
    this.end.z -= levels;
  }

  addToSupports(brick) {
    this.supports.add(brick);
  }

  markAsNotEssential() {
    this.canBeDesintegrated = true;
  }

  isSupporting(index) {
    return this.supports.has(index);
  }
}

const inputData = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map((snapshot, index) => new Brick(snapshot, index));

const getMaxValue = (axis) => inputData.toSorted((b, a) => a.end[axis] - b.end[axis])[0].end[axis] + 1;

const dropBricks = () => {
  let totalDroppedDistance = Infinity;
  while (totalDroppedDistance > 0) {
    totalDroppedDistance = 0;
    inputData.forEach(brick => {
      const headroom = brick.findHeadroom(tower);
      totalDroppedDistance += headroom;
      brick.moveDown(headroom);
    });
    tower.populate(inputData);
  }
};

const graph = Array.from({ length: inputData.length }, () => ({
  numberOfSupports: 0, supportedBy: new Set, supports: new Set,
}));

const findSupports = () => {
  inputData.forEach((brick, index) => {
    const targetZ = brick.end.z + 1;
    for (let i = 0; i < inputData.length; i++) {
      if (inputData[i].start.z !== targetZ) continue;
      if (!(brick.start.x <= inputData[i].end.x && brick.end.x >= inputData[i].start.x)) continue;
      if (!(brick.start.y <= inputData[i].end.y && brick.end.y >= inputData[i].start.y)) continue;

      brick.addToSupports(i);

      graph[i].numberOfSupports += 1;
      graph[i].supportedBy.add(index);
      graph[index].supports.add(i);
    }
  });
};

const checkForDuplicateSupports = () => {
  inputData.forEach(brick => {
    if ([...brick.supports].every(i => graph[i].numberOfSupports > 1)) brick.markAsNotEssential();
  });
};

const tower = new Tower(getMaxValue('x'), getMaxValue('y'), getMaxValue('z'));

tower.populate(inputData);
dropBricks();
findSupports();
checkForDuplicateSupports();

console.log(`Part 1: ${inputData.filter(brick => brick.canBeDesintegrated).length}`);

const findUpstream = (index) => {
  const disintegratedBricks = new Set();
  const stack = [];
  stack.push(index);

  while (stack.length > 0) {
    const i = stack.pop();
    if (i === index || [...graph[i].supportedBy].every(brick => disintegratedBricks.has(brick))) {
      disintegratedBricks.add(i);
      [...graph[i].supports].forEach(brick => {
        stack.push(brick);
      });
    }
  }

  return disintegratedBricks.size - 1;
};

console.log(`Part 2: ${inputData.reduce((acc, _, i) => acc + findUpstream(i), 0)}`);
