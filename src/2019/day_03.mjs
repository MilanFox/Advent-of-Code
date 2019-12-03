import * as fs from 'node:fs';

class Wire {
  constructor(data) {
    const directionOffset = { U: [0, -1], R: [1, 0], D: [0, 1], L: [-1, 0] };

    const instructions = data.split(',').map(el => ({
      dir: el[0], length: parseInt(el.slice(1)), offset: directionOffset[el[0]],
    }));

    this.drawLines(instructions);
  }

  drawLines(instructions) {
    this.lines = [];
    let y = 0;
    let x = 0;

    instructions.forEach(({ offset: [offsetX, offsetY], length }) => {
      const newY = offsetY * length + y;
      const newX = offsetX * length + x;

      this.lines.push({ x1: x, y1: y, x2: newX, y2: newY, length });

      y = newY;
      x = newX;
    });
  }
}

const doSegmentsIntersect = (line1, line2) => {
  const { x1: x1, y1: y1, x2: x2, y2: y2 } = line1;
  const { x1: x3, y1: y3, x2: x4, y2: y4 } = line2;

  const isSeg1Horizontal = y1 === y2;
  const isSeg2Horizontal = y3 === y4;

  const isPointWithinBoundingBox = (x, y, xMin, xMax, yMin, yMax) => x >= xMin && x <= xMax && y >= yMin && y <= yMax;

  if (isSeg1Horizontal && !isSeg2Horizontal) {
    if (isPointWithinBoundingBox(x3, y1, Math.min(x1, x2), Math.max(x1, x2), Math.min(y3, y4), Math.max(y3, y4))) {
      return { x: x3, y: y1 };
    }
  } else
    if (!isSeg1Horizontal && isSeg2Horizontal) {
      if (isPointWithinBoundingBox(x1, y3, Math.min(x3, x4), Math.max(x3, x4), Math.min(y1, y2), Math.max(y1, y2))) {
        return { x: x1, y: y3 };
      }
    }

  return null;
};

const wires = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new Wire(data));

const wireIntersections = [];

wires[0].lines.forEach(line1 => {
  wires[1].lines.forEach(line2 => {
    const intersectionPoint = doSegmentsIntersect(line1, line2);
    if (intersectionPoint && (intersectionPoint.x !== 0 || intersectionPoint.y !== 0)) wireIntersections.push(intersectionPoint);
  });
});

const closesIntersectionByManhattanDistance = wireIntersections
  .map(({ x, y }) => Math.abs(x) + Math.abs(y))
  .sort((a, b) => a - b)
  .at(0);

console.log(`Part 1: ${closesIntersectionByManhattanDistance}`);

const isPointOnLineSegment = (point, line) => {
  const { x1, y1, x2, y2 } = line;
  const { x: px, y: py } = point;

  if (y1 === y2) {
    if (py === y1 && px >= Math.min(x1, x2) && px <= Math.max(x1, x2)) {
      return Math.abs(px - x1);
    }
  } else
    if (x1 === x2) {
      if (px === x1 && py >= Math.min(y1, y2) && py <= Math.max(y1, y2)) {
        return Math.abs(py - y1);
      }
    }
  return null;
};

const findSignalStrength = (wire, point) => {
  let signalStrength = 0;

  for (const line of wire.lines) {
    const partialLength = isPointOnLineSegment(point, line);
    if (partialLength === null) signalStrength += line.length; else return signalStrength + partialLength;
  }

  return null;
};

wireIntersections.forEach(point => {
  point.signalStrength = [];
  wires.forEach((wire, i) => {
    point.signalStrength[i] = findSignalStrength(wire, point);
  });
});

const closestIntersectionBySignalStrength = wireIntersections.map(({ signalStrength }) => signalStrength.reduce((acc, cur) => acc + cur, 0)).sort((a, b) => a - b).at(0);

console.log(`Part 1: ${closestIntersectionBySignalStrength}`);
