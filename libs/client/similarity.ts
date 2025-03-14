import { disassembleHangul } from "es-hangul";

// From Toss Es-Hangul PR
// Ref: https://github.com/toss/es-hangul/pull/104

export function getSimilarity(left: string, right: string): number {
  const disassembledLeft = disassembleHangul(left).replace(/\s/g, '');
  const disassembledRight = disassembleHangul(right).replace(/\s/g, '');

  const maxLength = Math.max(disassembledLeft.length, disassembledRight.length);
  if (maxLength === 0) {
    return 100;
  }

  const distance = levenshtein(disassembledLeft, disassembledRight);
  const similarity = (maxLength - distance) / maxLength;

  return similarity;
}

const initializeLevenshteinMatrix = (rows: number, cols: number): number[][] =>
  Array.from({ length: rows }, (_, i) => Array.from({ length: cols }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));

const computeLevenshteinRow = (prevRow: number[], bChar: string, a: string): number[] =>
  a.split('').reduce(
    (newRow, aChar, j) => {
      newRow[j + 1] = bChar === aChar ? prevRow[j] : Math.min(prevRow[j] + 1, newRow[j] + 1, prevRow[j + 1] + 1);
      return newRow;
    },
    [prevRow[0] + 1]
  );

const computeLevenshteinDistance = (a: string, b: string, matrix: number[][]): number =>
  b.split('').reduce((prevRow, bChar) => computeLevenshteinRow(prevRow, bChar, a), matrix[0])[a.length];

const levenshtein = (a: string, b: string): number => {
  const matrix = initializeLevenshteinMatrix(b.length + 1, a.length + 1);
  return computeLevenshteinDistance(a, b, matrix);
};