import type { Coords } from '../../../types';

import drawOutlinedText from './drawOutlinedText';

type Label = Coords & {
  text: string;
  angle?: number;
};

interface DrawLabelParams {
  context: CanvasRenderingContext2D;
  label: Label;
  mapCoordOffset: Coords;
  zoomScale: number;
  horizontalVisibilityMargin: number;
  verticalVisibilityMargin: number;
  lineHeight: number;
}

const drawLabel = ({
  context,
  label,
  mapCoordOffset,
  zoomScale,
  horizontalVisibilityMargin,
  verticalVisibilityMargin,
  lineHeight,
}: DrawLabelParams) => {
  const shouldDrawLabel =
    mapCoordOffset.x - horizontalVisibilityMargin * zoomScale < label.x && // checking left edge of the screen
    mapCoordOffset.x +
      window.innerWidth * zoomScale +
      horizontalVisibilityMargin * zoomScale >
      label.x && // right edge
    mapCoordOffset.y - verticalVisibilityMargin * zoomScale < label.y && // top edge
    mapCoordOffset.y +
      window.innerHeight * zoomScale +
      verticalVisibilityMargin * zoomScale >
      label.y; // bottom edge

  if (!shouldDrawLabel) {
    return;
  }

  const labelScreenX = (label.x - mapCoordOffset.x) / zoomScale;
  const labelScreenY = (label.y - mapCoordOffset.y) / zoomScale;
  const labelLines = label.text.split('\n');

  labelLines.forEach((labelPart, index) => {
    drawOutlinedText({
      context,
      text: labelPart,
      x: labelScreenX,
      y: labelScreenY + lineHeight * index,
      angle: label.angle,
    });
  });
};

export default drawLabel;
