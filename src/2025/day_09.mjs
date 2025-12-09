import { readFileSync } from 'node:fs';

const tiles = readFileSync('input.txt', 'utf-8').trim().split('\n').map(line => line.split(',').map(Number));

const getAllPermutations = (arr) => {
  const permutations = [];
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      permutations.push([arr[i], arr[j]]);
    }
  }
  return permutations;
};

const getArea = ([[x1, y1], [x2, y2]]) => (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);

const rectangles = getAllPermutations(tiles);

const getLargestPossibleArea = (rectangles) => rectangles.map(getArea).sort((a, b) => b - a).at(0);

console.log(`Part 1: ${getLargestPossibleArea(rectangles)}`);

const getPolygonLineSegments = (corners) => corners.reduce((acc, [curX, curY], i) => {
  const [nextX, nextY] = corners[i + 1] ?? corners[0];
  const line = [[curX, curY], [nextX, nextY]];
  if (curX === nextX) acc.vertical.push(line.sort(([, a], [, b]) => a - b));
  else acc.horizontal.push(line.sort(([a], [b]) => a - b));
  return acc;
}, { horizontal: [], vertical: [] });

const getCorners = ([[x1, y1], [x2, y2]]) => [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];

const hasIntersection = ([[a1x, a1y], [a2x, a2y]], [[b1x, b1y], [b2x, b2y]]) => {
  let [verticalLineX, verticalYStart, verticalYEnd] = a1x === a2x ? [a1x, a1y, a2y] : [b1x, b1y, b2y];
  let [horizontalLineY, horizontalXStart, horizontalXEnd] = a1y === a2y ? [a1y, a1x, a2x] : [b1y, b1x, b2x];
  return verticalLineX > horizontalXStart && verticalLineX < horizontalXEnd && horizontalLineY > verticalYStart && horizontalLineY < verticalYEnd;
};

const polygonLineSegments = getPolygonLineSegments(tiles);

/**
 * @see https://math.stackexchange.com/questions/3210317/how-to-check-if-a-given-point-lies-inside-a-rectilinear-figure
 */
const isInsidePolygon = ([px, py]) => {
  let edgeCrossings = 0;

  for (const [[x, y1], [_, y2]] of polygonLineSegments.vertical) {
    if (x === px && py >= y1 && py <= y2) return true;
    if (x < px && py >= y1 && py < y2) edgeCrossings++;
  }

  for (const [[x1, y], [x2]] of polygonLineSegments.horizontal) {
    if (y === py && px >= x1 && px <= x2) return true;
  }

  return edgeCrossings % 2 === 1;
};

const containingRectangles = rectangles.filter((rect) => {
  const corners = getCorners(rect);
  if (corners.some(point => !isInsidePolygon(point))) return false;
  const { horizontal: horizontalLines, vertical: verticalLines } = getPolygonLineSegments(corners);
  const intersectsHorizontally = horizontalLines.some(line => polygonLineSegments.vertical.some(segment => hasIntersection(line, segment)));
  const intersectsVertically = verticalLines.some(line => polygonLineSegments.horizontal.some(segment => hasIntersection(line, segment)));
  return !intersectsHorizontally && !intersectsVertically;
});

console.log(`Part 2: ${getLargestPossibleArea(containingRectangles)}`);
