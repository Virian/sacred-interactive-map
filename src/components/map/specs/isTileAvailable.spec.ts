import isTileAvailable from '../isTileAvailable'
import { Coords } from '../types';

jest.mock('../../../assets/availableTiles.json', () => [
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
]);

const cases: [Coords, boolean][] = [
  [{ x: 0, y: 0 }, true],
  [{ x: 0, y: 5 }, true],
  [{ x: 4, y: 4 }, true],
  [{ x: 4, y: 1 }, true],
  [{ x: 5, y: 5 }, false],
  [{ x: 0, y: 3 }, false],
  [{ x: 4, y: 3 }, false],
  [{ x: 8, y: 8 }, false],
  [{ x: 2, y: 8 }, false],
  [{ x: 8, y: 2 }, false],
];

describe('isTileAvailable', () => {
  it.each(cases)(
    'for coords %o should return %p',
    (coords, expectedResult) => {
      // when
      const result = isTileAvailable(coords);

      // then
      expect(result).toBe(expectedResult);
    }
  )
});