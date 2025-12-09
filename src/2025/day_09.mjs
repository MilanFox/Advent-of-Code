import { readFileSync } from 'node:fs';

const tiles = readFileSync('testinput.txt', 'utf-8').trim().split('\n').map(line => line.split(',').map(Number));

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

console.log(`Part 1: ${rectangles.map(getArea).sort((a, b) => b - a).at(0)}`);

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

const isInsidePolygon = ([px, py]) => {
  const edgeCrossings = polygonLineSegments.vertical.filter(([[x, y1], [_, y2]]) => x <= px && y1 <= py && y2 >= py).length;
  return edgeCrossings % 2 !== 0;
};

const containingRectangles = rectangles.filter((rect) => {
  const corners = getCorners(rect);
  const { horizontal: horizontalLines, vertical: verticalLines } = getPolygonLineSegments(corners);
  const intersectsHorizontally = horizontalLines.some(line => polygonLineSegments.vertical.some(segment => hasIntersection(line, segment)));
  const intersectsVertically = verticalLines.some(line => polygonLineSegments.horizontal.some(segment => hasIntersection(line, segment)));
  return !intersectsHorizontally && !intersectsVertically;
});

/**DEBUG*/
containingRectangles
  .map(rect => ({ area: getArea(rect), p1: { x: rect[0][0], y: rect[0][1] }, p2: { x: rect[1][0], y: rect[1][1] } }))
  .sort((a, b) => b.area - a.area);

