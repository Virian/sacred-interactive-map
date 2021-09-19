import { Coords } from './types';

interface TranslateScreenToCoordsParams {
  screenCoords: Coords;
  mapCoordOffset: Coords;
  scaleDivision?: number;
}

const translateScreenToCoords = ({ screenCoords, mapCoordOffset, scaleDivision = 1 }: TranslateScreenToCoordsParams): Coords => {
  const coordX = mapCoordOffset.x + (screenCoords.x * scaleDivision);
  const coordY = mapCoordOffset.y + (screenCoords.y * scaleDivision);

  return {
    x: coordX >= 0 ? coordX : 0,
    y: coordY >= 0 ? coordY : 0,
  }
};

export default translateScreenToCoords;
