import type { Coords } from '../../types';

interface IsPointInRectParams {
  point: Coords;
  rect: Coords & { width: number; height: number };
}

const isPointInRect = ({ point, rect }: IsPointInRectParams) =>
  point.x >= rect.x &&
  point.x <= rect.x + rect.width &&
  point.y >= rect.y &&
  point.y <= rect.y + rect.height;

export default isPointInRect;
