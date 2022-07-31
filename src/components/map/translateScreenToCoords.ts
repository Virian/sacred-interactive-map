import { Coords } from '../../types';

interface TranslateScreenToCoordsParams {
  screenCoords: Coords;
  mapCoordOffset: Coords;
  scale?: number;
}

const translateScreenToCoords = ({
  screenCoords,
  mapCoordOffset,
  scale = 1,
}: TranslateScreenToCoordsParams): Coords => {
  const coordX = mapCoordOffset.x + screenCoords.x * scale;
  const coordY = mapCoordOffset.y + screenCoords.y * scale;

  return {
    x: coordX >= 0 ? coordX : 0,
    y: coordY >= 0 ? coordY : 0,
  };
};

export default translateScreenToCoords;
