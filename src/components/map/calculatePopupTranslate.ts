import { Coords } from '../../types';

import { MARKER_SIZE } from './constants';

const calculatePopupTranslate = (
  markerCoords: Coords | null,
  mapCoordOffset: Coords,
  zoomLevelScale: number
): Coords => {
  if (!markerCoords) {
    return {
      x: 0,
      y: 0,
    };
  }

  const screenX =
    (markerCoords.x - mapCoordOffset.x) / zoomLevelScale - MARKER_SIZE / 2;
  const screenY =
    (markerCoords.y - mapCoordOffset.y) / zoomLevelScale - MARKER_SIZE / 2;

  return {
    x: screenX,
    y: screenY,
  };
};

export default calculatePopupTranslate;
