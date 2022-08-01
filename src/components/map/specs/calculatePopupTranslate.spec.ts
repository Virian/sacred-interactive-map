import { Coords } from '../../../types';
import calculatePopupTranslate from '../calculatePopupTranslate';

const cases: [Coords | null, Coords, number, Coords][] = [
  [{ x: 0, y: 0 }, { x: 0, y: 0 }, 1, { x: -16, y: -16 }],
  [{ x: 124, y: 7544 }, { x: 0, y: 0 }, 1, { x: 108, y: 7528 }],
  [{ x: 0, y: 0 }, { x: 634, y: 22 }, 1, { x: -650, y: -38 }],
  [{ x: 34634, y: 909 }, { x: 4235, y: 66227 }, 1, { x: 30383, y: -65334 }],
  [{ x: 0, y: 0 }, { x: 0, y: 0 }, 3, { x: -16, y: -16 }],
  [{ x: 126, y: 7545 }, { x: 0, y: 0 }, 3, { x: 26, y: 2499 }],
  [{ x: 0, y: 0 }, { x: 636, y: 24 }, 3, { x: -228, y: -24 }],
  [{ x: 34634, y: 909 }, { x: 4235, y: 66228 }, 3, { x: 10117, y: -21789 }],
  [null, { x: 0, y: 0 }, 1, { x: 0, y: 0 }],
];

describe('calculatePopupTranslate', () => {
  it.each(cases)(
    'should return correct translate values for marker %o, map offset %o, zoom scale %d',
    (markerCoords, mapCoordOffset, zoomLevelScale, expectedResult) => {
      // when
      const result = calculatePopupTranslate(
        markerCoords,
        mapCoordOffset,
        zoomLevelScale
      );

      // then
      expect(result).toStrictEqual(expectedResult);
    }
  );
});
