import { describe, expect, it } from 'vitest';

import { Coords } from '../../../types';
import calculatePopupTranslate from '../calculatePopupTranslate';

const cases: [Coords | null, Coords, number, number, Coords][] = [
  [{ x: 0, y: 0 }, { x: 0, y: 0 }, 1, 32, { x: -16, y: -16 }],
  [{ x: 124, y: 7544 }, { x: 0, y: 0 }, 1, 32, { x: 108, y: 7528 }],
  [{ x: 0, y: 0 }, { x: 634, y: 22 }, 1, 32, { x: -650, y: -38 }],
  [{ x: 34634, y: 909 }, { x: 4235, y: 66227 }, 1, 32, { x: 30383, y: -65334 }],
  [{ x: 0, y: 0 }, { x: 0, y: 0 }, 3, 32, { x: -16, y: -16 }],
  [{ x: 126, y: 7545 }, { x: 0, y: 0 }, 3, 32, { x: 26, y: 2499 }],
  [{ x: 0, y: 0 }, { x: 636, y: 24 }, 3, 32, { x: -228, y: -24 }],
  [{ x: 34634, y: 909 }, { x: 4235, y: 66228 }, 3, 32, { x: 10117, y: -21789 }],
  [null, { x: 0, y: 0 }, 1, 32, { x: 0, y: 0 }],
  [{ x: 0, y: 0 }, { x: 0, y: 0 }, 1, 64, { x: -32, y: -32 }],
  [{ x: 124, y: 7544 }, { x: 0, y: 0 }, 1, 64, { x: 92, y: 7512 }],
  [{ x: 0, y: 0 }, { x: 636, y: 24 }, 3, 64, { x: -244, y: -40 }],
  [{ x: 34634, y: 909 }, { x: 4235, y: 66228 }, 3, 64, { x: 10101, y: -21805 }],
  [null, { x: 0, y: 0 }, 1, 64, { x: 0, y: 0 }],
];

describe('calculatePopupTranslate', () => {
  it.each(cases)(
    'should return correct translate values for marker %o, map offset %o, zoom scale %d, marker size %d',
    (
      markerCoords,
      mapCoordOffset,
      zoomLevelScale,
      markerSize,
      expectedResult,
    ) => {
      // when
      const result = calculatePopupTranslate(
        markerCoords,
        mapCoordOffset,
        zoomLevelScale,
        markerSize,
      );

      // then
      expect(result).toStrictEqual(expectedResult);
    },
  );
});
