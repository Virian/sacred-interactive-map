import regionsData from '../../assets/regions.json';

import type { Coords, ZoomLevel } from '../../types';

interface DrawRegionsParams {
  context: CanvasRenderingContext2D;
  shouldDisplayRegions: boolean;
  mapCoordOffset: Coords;
  zoomLevel: ZoomLevel;
}

const drawRegions = async ({
  context,
  shouldDisplayRegions,
  mapCoordOffset,
  zoomLevel,
}: DrawRegionsParams) => {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  if (!shouldDisplayRegions) {
    return;
  }

  context.lineWidth = 3;

  regionsData.forEach(({ boundaries, color }) => {
    context.fillStyle = `rgb(from ${color} r g b / 40%)`;
    context.strokeStyle = color;

    boundaries.forEach((boundary) => {
      const [firstPoint, ...restPoints] = boundary;
      context.beginPath();
      const firstPointScreenX =
        (firstPoint.x - mapCoordOffset.x) / zoomLevel.scale;
      const furstPointScreenY =
        (firstPoint.y - mapCoordOffset.y) / zoomLevel.scale;
      context.moveTo(firstPointScreenX, furstPointScreenY);

      restPoints.forEach(({ x, y }) => {
        const pointScreenX = (x - mapCoordOffset.x) / zoomLevel.scale;
        const pointScreenY = (y - mapCoordOffset.y) / zoomLevel.scale;
        context.lineTo(pointScreenX, pointScreenY);
      });

      context.closePath();
      context.fill();
      context.stroke();
    });
  });
};

export default drawRegions;
