import { Coords } from '../types';
import { MAP_WIDTH, MAP_HEIGHT } from '../constants';

const getOffsetToCenterOnPoint = (
  point: Coords,
  zoomLevelScale: number = 1,
) => ({
  x: Math.max(
    0,
    Math.min(
      point.x - (window.innerWidth / 2) * zoomLevelScale,
      MAP_WIDTH - window.innerWidth * zoomLevelScale,
    ),
  ),
  y: Math.max(
    0,
    Math.min(
      point.y - (window.innerHeight / 2) * zoomLevelScale,
      MAP_HEIGHT - window.innerHeight * zoomLevelScale,
    ),
  ),
});

export default getOffsetToCenterOnPoint;
