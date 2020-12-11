import * as fs from 'node:fs';

const TYPE = { SEAT: 'L', FLOOR: '.' };

class Position {
  constructor({ type, x, y }) {
    [this.x, this.y] = [x, y];
    if (type === TYPE.SEAT) this.isSeat = true;
    if (this.isSeat) this.isOccupied = false;
    this.generalNeighborSeats = [];
  }

  findDirectNeighbors(map) {
    const directions = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
    this.directNeighborSeats = directions.map(([x, y]) => map[this.y + y]?.[this.x + x]).filter(position => position?.isSeat);
  }

  findGeneralNeighbors(map) {
    const directions = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];

    directions.forEach(([offsetX, offsetY]) => {
      let X = this.x + offsetX;
      let Y = this.y + offsetY;
      while (Y >= 0 && Y < map.length && X >= 0 && X < map[0].length) {
        if (map[Y][X].isSeat) {
          this.generalNeighborSeats.push(map[Y][X]);
          break;
        }

        X += offsetX;
        Y += offsetY;
      }
    });
  }

  shouldToggle({ directNeighbors, overCrowdedLimit }) {
    const neighbors = directNeighbors ? this.directNeighborSeats : this.generalNeighborSeats;
    const numberOfOccupiedNeighbors = neighbors.filter(seat => seat.isOccupied).length;
    const isOvercrowded = this.isOccupied && numberOfOccupiedNeighbors >= overCrowdedLimit;
    const isVacant = !this.isOccupied && numberOfOccupiedNeighbors === 0;
    return isOvercrowded || isVacant;
  }

  toggleOccupancy() {
    this.isOccupied = !this.isOccupied;
  }
}

class Ferry {
  constructor(data) {
    this.mapFerry(data);
  }

  mapFerry(data) {
    this.map = data.map((row, y) => row.split('').map((type, x) => new Position({ type, y, x })));
    this.allSeats.forEach(seat => seat.findDirectNeighbors(this.map));
    this.allSeats.forEach(seat => seat.findGeneralNeighbors(this.map));
  }

  get allSeats() {
    return this.map.flat().filter(seat => seat.isSeat);
  }

  simulateBoarding(options = { directNeighbors: true, overCrowdedLimit: 4 }) {
    while (true) {
      const toggleList = this.allSeats.filter(seat => seat.shouldToggle(options));
      if (!toggleList.length) break;
      toggleList.forEach(seat => seat.toggleOccupancy());
    }

    return this.map.flat().filter(position => position.isSeat && position.isOccupied).length;
  }
}

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n');
const ferry = new Ferry(inputData);

console.log(`Part 1: ${ferry.simulateBoarding()}`);

ferry.mapFerry(inputData);
console.log(`Part 2: ${ferry.simulateBoarding({ directNeighbors: false, overCrowdedLimit: 5 })}`);
