import getTileCoordsForView from '../getTileCoordsForView';

const cases: [number, number, number, number, { tileXCoords: number[], tileYCoords: number[] }][] = [
  [
    6,
    3,
    1000,
    1000,
    { tileXCoords: [2, 3, 4, 5, 6, 7], tileYCoords: [2, 3, 4] },
  ],
  [
    10,
    7,
    512,
    1024,
    { tileXCoords: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], tileYCoords: [3, 4, 5, 6, 7, 8, 9] },
  ],
  [
    8,
    5,
    0,
    0,
    { tileXCoords: [-1, 0, 1, 2, 3, 4, 5, 6], tileYCoords: [-1, 0, 1, 2, 3] },
  ],
  [
    5,
    5,
    12345,
    20202,
    { tileXCoords: [47, 48, 49, 50, 51], tileYCoords: [77, 78, 79, 80, 81] },
  ],
];

describe('getTileCoordsForView', () => {
  it.each(cases)(
    'should return correct values for %d horizontal tiles, %d vertical tiles, %d x offset and %d y offset',
    (
      numberOfHorizontalTiles,
      numberOfVerticalTiles,
      currentXOffset,
      currentYOffset,
      expectedResult,
    ) => {
      // when
      const result = getTileCoordsForView(
        numberOfHorizontalTiles,
        numberOfVerticalTiles,
        currentXOffset,
        currentYOffset,
      );

      // then
      expect(result).toStrictEqual(expectedResult);
    }
  )
});
