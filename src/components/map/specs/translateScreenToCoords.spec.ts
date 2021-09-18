import translateScreenToCoords from '../translateScreenToCoords';
import { Coords } from '../types';

const cases: [Coords, Coords, Coords][] = [
  [{ x: 500, y: 200 }, { x: 12277, y: 5823 }, { x: 12777, y: 6023 }],
  [{ x: 812, y: 425 }, { x: 6724, y: 381 }, { x: 7536, y: 806 }],
  [{ x: 2, y: 3 }, { x: 1, y: 1 }, { x: 3, y: 4 }],
  [{ x: -13, y: -20 }, { x: 2, y: 2 }, { x: 0, y: 0 }],
  [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }],
];

describe('translateScreenToCoords', () => {
  it.each(cases)(
    'should return correct map coords',
    (screenCoords, mapCoordOffset, expectedCoords) => {
      // when
      const result = translateScreenToCoords({ screenCoords, mapCoordOffset });

      // then
      expect(result).toEqual(expectedCoords);
    }
  )
});
