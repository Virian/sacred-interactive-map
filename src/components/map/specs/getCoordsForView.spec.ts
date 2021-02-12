import getCoordsForView from '../getCoordsForView';

const cases: [number, number, number, number, { xCoords: number[], yCoords: number[] }][] = [
  [
    6,
    3,
    1000,
    1000,
    { xCoords: [2, 3, 4, 5, 6, 7], yCoords: [2, 3, 4] },
  ],
  [
    10,
    7,
    512,
    1024,
    { xCoords: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], yCoords: [3, 4, 5, 6, 7, 8, 9] },
  ],
  [
    8,
    5,
    0,
    0,
    { xCoords: [-1, 0, 1, 2, 3, 4, 5, 6], yCoords: [-1, 0, 1, 2, 3] },
  ],
  [
    5,
    5,
    12345,
    20202,
    { xCoords: [47, 48, 49, 50, 51], yCoords: [77, 78, 79, 80, 81] },
  ],
];

describe('getCoordsForView', () => {
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
      const result = getCoordsForView(numberOfHorizontalTiles, numberOfVerticalTiles, currentXOffset, currentYOffset);

      // then
      expect(result).toStrictEqual(expectedResult);
    }
  )
});
