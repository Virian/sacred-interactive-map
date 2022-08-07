import { Coords } from '../../types';

const calculatePopupTranslate = (
  markerCoords: Coords | null,
  mapCoordOffset: Coords,
  zoomLevelScale: number,
  markerSize: number = 0
): Coords => {
  if (!markerCoords) {
    return {
      x: 0,
      y: 0,
    };
  }

  const screenX =
    (markerCoords.x - mapCoordOffset.x) / zoomLevelScale - markerSize / 2;
  const screenY =
    (markerCoords.y - mapCoordOffset.y) / zoomLevelScale - markerSize / 2;

  return {
    x: screenX,
    y: screenY,
  };
};

export default calculatePopupTranslate;
