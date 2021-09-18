import { Coords } from './types';

interface TranslateScreenToCoordsParams {
  screenCoords: Coords;
  mapCoordOffset: Coords;
}

const translateScreenToCoords = ({ screenCoords, mapCoordOffset }: TranslateScreenToCoordsParams): Coords => {
  const coordX = mapCoordOffset.x + screenCoords.x;
  const coordY = mapCoordOffset.y + screenCoords.y;

  return {
    x: coordX >= 0 ? coordX : 0,
    y: coordY >= 0 ? coordY : 0,
  }
};

export default translateScreenToCoords;
