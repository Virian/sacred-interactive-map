import { describe, expect, it } from 'vitest';

import coordToString from '../coordToString';

const cases: [number, string][] = [
  [0, '000'],
  [6, '006'],
  [20, '020'],
  [38, '038'],
  [65, '065'],
  [265, '265'],
  [745, '745'],
  [999, '999'],
];

describe('coordToString', () => {
  it.each(cases)(
    'should return padded string for %d',
    (coord, expectedResult) => {
      // when
      const result = coordToString(coord);

      // then
      expect(result).toBe(expectedResult);
    },
  );
});
