import { describe, expect, it, vi } from 'vitest';

import isTileAvailable from '../isTileAvailable';
import { Coords } from '../../../types';

vi.mock('../../../assets/availableTiles.json', () => ({
  default: {
    '1': [
      { x: 0, y: 0 },
      { x: 0, y: 2 },
      { x: 0, y: 5 },
      { x: 1, y: 3 },
      { x: 2, y: 2 },
      { x: 2, y: 2 },
      { x: 4, y: 0 },
      { x: 4, y: 1 },
      { x: 4, y: 4 },
      { x: 4, y: 5 },
      { x: 5, y: 2 },
    ],
    '2': [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
      { x: 3, y: 2 },
    ],
  },
}));

const cases: [Coords, number, boolean][] = [
  [{ x: 0, y: 0 }, 1, true],
  [{ x: 0, y: 5 }, 1, true],
  [{ x: 4, y: 4 }, 1, true],
  [{ x: 4, y: 1 }, 1, true],
  [{ x: 5, y: 5 }, 1, false],
  [{ x: 0, y: 3 }, 1, false],
  [{ x: 4, y: 3 }, 1, false],
  [{ x: 8, y: 8 }, 1, false],
  [{ x: 2, y: 8 }, 1, false],
  [{ x: 8, y: 2 }, 1, false],
  [{ x: 0, y: 1 }, 2, true],
  [{ x: 1, y: 3 }, 2, true],
  [{ x: 3, y: 2 }, 2, true],
  [{ x: 0, y: 2 }, 2, false],
  [{ x: 1, y: 0 }, 2, false],
  [{ x: 2, y: 2 }, 2, false],
];

describe('isTileAvailable', () => {
  it.each(cases)(
    'for coords %o should return %p',
    (coords, zoomLevelNumber, expectedResult) => {
      // when
      const result = isTileAvailable({ ...coords, zoomLevelNumber });

      // then
      expect(result).toBe(expectedResult);
    },
  );
});
