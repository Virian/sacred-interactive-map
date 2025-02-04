import { SHOULD_DRAW_COORDS, SHOULD_USE_GAME_COORDS } from '../../config';
import { Coords, ZoomLevel } from '../../types';

import translateScreenToCoords from './translateScreenToCoords';
import translateMapCoordsToGameCoords from './translateMapCoordsToGameCoords';

interface DrawMouseCoordsParams {
  context: CanvasRenderingContext2D;
  mapCoordOffset: Coords;
  zoomLevel: ZoomLevel;
  mousePosition: Coords;
}

const drawMouseCoords = ({
  context,
  mapCoordOffset,
  zoomLevel,
  mousePosition,
}: DrawMouseCoordsParams) => {
  if (SHOULD_DRAW_COORDS) {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = 'white';
    context.font = '18px serif';

    let cursorCoords = translateScreenToCoords({
      screenCoords: mousePosition,
      mapCoordOffset,
      scale: zoomLevel.scale,
    });
    if (SHOULD_USE_GAME_COORDS) {
      cursorCoords = translateMapCoordsToGameCoords(cursorCoords);
    }

    context.fillText(
      `(${cursorCoords.x}, ${cursorCoords.y})`,
      mousePosition.x,
      mousePosition.y,
    );
  }
};

export default drawMouseCoords;
