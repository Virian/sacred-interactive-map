import translateMapCoordsToGameCoords from '../translateMapCoordsToGameCoords';
import { Coords } from '../types';

const cases: [Coords, Coords][] = [
  [{ x: 29190, y: 11625 }, { x: 3355, y: 2457 }], // Bellevue portal
  [{ x: 19055, y: 10710 }, { x: 1860, y: 3496 }], // Mascarell portal
  [{ x: 27380, y: 8930 }, { x: 2455, y: 2010 }], // Braverock portal
  [{ x: 25240, y: 14180 }, { x: 3500, y: 3590 }], // Khorad nur portal
  [{ x: 25147, y: 5807 }, { x: 1395, y: 1508 }], // Seraphim monastery portal
  [{ x: 23940, y: 11400 }, { x: 2642, y: 3057 }], // Porto Vallum portal
  [{ x: 22015, y: 7165 }, { x: 1343, y: 2239 }], // Icecreek Valley portal
  [{ x: 31815, y: 13141 }, { x: 4062, y: 2508 }], // Mystdale portal
  [{ x: 33175, y: 9375 }, { x: 3291, y: 1397 }], // Zhurag nar portal
  [{ x: 25720, y: 4048 }, { x: 1027, y: 996 }], // Purgatori portal
  [{ x: 17136, y: 4795 }, { x: 141, y: 2256 }], // VoT portal
];

describe('translateMapCoordsToGameCoords', () => {
  it.each(cases)(
    'should return correct game coords',
    (mapCoords, expectedGameCoords) => {
      // given
      const allowedError = 10;

      // when
      const result = translateMapCoordsToGameCoords(mapCoords);

      // then
      expect(result.x).toBeGreaterThan(expectedGameCoords.x - allowedError);
      expect(result.x).toBeLessThan(expectedGameCoords.x + allowedError);
      expect(result.y).toBeGreaterThan(expectedGameCoords.y - allowedError);
      expect(result.y).toBeLessThan(expectedGameCoords.y + allowedError);
    }
  )
});
