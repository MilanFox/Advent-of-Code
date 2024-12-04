import fs from 'node:fs';

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => data.split(' ').map(Number));

const isDecreasing = (report) => report.every((level, i, arr) => i === 0 || level < arr[i - 1]);
const isIncreasing = (report) => report.every((level, i, arr) => i === 0 || level > arr[i - 1]);
const hasCorrectStepDistance = (report) => report.every((val, i, arr) => i === 0 || (Math.abs(val - arr[i - 1]) >= 1 && Math.abs(val - arr[i - 1]) <= 3));

const isSafe = (report) => (isDecreasing(report) || isIncreasing(report)) && hasCorrectStepDistance(report);

const numberOfSafeReports = inputData.filter(isSafe).length;
console.log(`Part 1: ${numberOfSafeReports}`);

const unsafeReports = inputData.filter(report => !isSafe(report));
const withTolerance = (report) => report.map((_, i) => report.filter((_, j) => j !== i));
const isSafeAfterTolerance = (report) => withTolerance(report).some(isSafe);

const numberOfMostlySafeReports = unsafeReports.filter(isSafeAfterTolerance).length;
console.log(`Part 2: ${numberOfSafeReports + numberOfMostlySafeReports}`);
