import { SHOULD_DRAW_COORDS, SHOULD_USE_GAME_COORDS } from '../../config';

import { Coords } from './types';
import translateScreenToCoords from './translateScreenToCoords';
import translateMapCoordsToGameCoords from './translateMapCoordsToGameCoords';

interface DrawMouseCoordsParams {
  context: CanvasRenderingContext2D;
  mapCoordOffset: Coords;
  scaleLevel: { scale: number; level: number };
  mousePosition: Coords;
}

const drawMouseCoords = ({
  context,
  mapCoordOffset,
  scaleLevel,
  mousePosition,
}: DrawMouseCoordsParams) => {
  if (SHOULD_DRAW_COORDS) {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = 'white';
    context.font = '18px serif';

    let cursorCoords = translateScreenToCoords({
      screenCoords: mousePosition,
      mapCoordOffset,
      scale: scaleLevel.scale,
    });
    if (SHOULD_USE_GAME_COORDS) {
      cursorCoords = translateMapCoordsToGameCoords(cursorCoords);
    }

    context.fillText(
      `(${cursorCoords.x}, ${cursorCoords.y})`,
      mousePosition.x,
      mousePosition.y
    );
  }
};

export default drawMouseCoords;
