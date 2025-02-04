import { describe, expect, it } from 'vitest';

import getTileCoordsForView from '../getTileCoordsForView';

const cases: [
  number,
  number,
  number,
  number,
  number,
  { tileXCoords: number[]; tileYCoords: number[] },
][] = [
  [
    6,
    3,
    1000,
    1000,
    1,
    { tileXCoords: [2, 3, 4, 5, 6, 7], tileYCoords: [2, 3, 4] },
  ],
  [
    10,
    7,
    512,
    1024,
    1,
    {
      tileXCoords: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      tileYCoords: [3, 4, 5, 6, 7, 8, 9],
    },
  ],
  [
    8,
    5,
    0,
    0,
    1,
    { tileXCoords: [-1, 0, 1, 2, 3, 4, 5, 6], tileYCoords: [-1, 0, 1, 2, 3] },
  ],
  [
    5,
    5,
    12345,
    20202,
    1,
    { tileXCoords: [47, 48, 49, 50, 51], tileYCoords: [77, 78, 79, 80, 81] },
  ],
  [
    6,
    3,
    1000,
    1000,
    3,
    { tileXCoords: [0, 1, 2, 3, 4, 5], tileYCoords: [0, 1, 2] },
  ],
  [
    10,
    7,
    512,
    1024,
    3,
    {
      tileXCoords: [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8],
      tileYCoords: [0, 1, 2, 3, 4, 5, 6],
    },
  ],
  [
    8,
    5,
    0,
    0,
    3,
    { tileXCoords: [-1, 0, 1, 2, 3, 4, 5, 6], tileYCoords: [-1, 0, 1, 2, 3] },
  ],
  [
    5,
    5,
    12345,
    20202,
    3,
    { tileXCoords: [15, 16, 17, 18, 19], tileYCoords: [25, 26, 27, 28, 29] },
  ],
];

describe('getTileCoordsForView', () => {
  it.each(cases)(
    'should return correct values for %d horizontal tiles, %d vertical tiles, %d x offset, %d y offset and scale of %d',
    (
      numberOfHorizontalTiles,
      numberOfVerticalTiles,
      currentXOffset,
      currentYOffset,
      scale,
      expectedResult,
    ) => {
      // when
      const result = getTileCoordsForView(
        numberOfHorizontalTiles,
        numberOfVerticalTiles,
        currentXOffset,
        currentYOffset,
        scale,
      );

      // then
      expect(result).toStrictEqual(expectedResult);
    },
  );
});
