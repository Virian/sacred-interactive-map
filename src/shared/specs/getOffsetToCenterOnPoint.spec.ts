import { beforeAll, describe, expect, it, vi } from 'vitest';
import getOffsetToCenterOnPoint from '../getOffsetToCenterOnPoint';
import { Coords } from '../../types';

vi.mock('../../constants', () => ({
  MAP_WIDTH: 20000,
  MAP_HEIGHT: 10000,
}));

const cases: [Coords, number | undefined, Coords][] = [
  [{ x: 6500, y: 5000 }, 1, { x: 5540, y: 4460 }],
  [{ x: 6500, y: 5000 }, undefined, { x: 5540, y: 4460 }],
  [{ x: 100, y: 200 }, 1, { x: 0, y: 0 }],
  [{ x: 19800, y: 9900 }, 1, { x: 18080, y: 8920 }],
  [{ x: -100, y: -100 }, 1, { x: 0, y: 0 }],
  [{ x: 6500, y: 5000 }, 5, { x: 1700, y: 2300 }],
  [{ x: 100, y: 200 }, 5, { x: 0, y: 0 }],
  [{ x: 19800, y: 9900 }, 5, { x: 10400, y: 4600 }],
  [{ x: -100, y: -100 }, 5, { x: 0, y: 0 }],
];

describe('getMarkerFromSearchParams', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1080,
    });
  });

  it.each(cases)(
    'should return correct map offset to center on point %o with scale %d',
    (pointCoords, zoomScaleNumber, expectedResult) => {
      // when
      const result = getOffsetToCenterOnPoint(pointCoords, zoomScaleNumber);

      // then
      expect(result).toStrictEqual(expectedResult);
    },
  );
});
