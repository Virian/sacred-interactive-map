import townLabelsData from '../../../assets/townLabels.json';
import type { Coords, ZoomLevel } from '../../../types';

import {
  mapZoomLevelToFontSize,
  regionLabels,
  REGION_LABEL_VISIBILITY_MARGIN,
  TOWN_LABEL_HORIZONTAL_VISIBILITY_MARGIN,
  TOWN_LABEL_VERTICAL_VISIBILITY_MARGIN,
} from './constants';
import drawLabel from './drawLabel';
import loadSacredFont from './loadSacredFont';

let isFontLoaded = false;

interface DrawMapLabelsParams {
  context: CanvasRenderingContext2D;
  shouldDisplayLabels: boolean;
  showRegions: boolean;
  mapCoordOffset: Coords;
  zoomLevel: ZoomLevel;
}

const drawMapLabels = async ({
  context,
  shouldDisplayLabels,
  showRegions,
  mapCoordOffset,
  zoomLevel,
}: DrawMapLabelsParams) => {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  if (!shouldDisplayLabels) {
    return;
  }

  if (!isFontLoaded) {
    await loadSacredFont();
    isFontLoaded = true;
  }

  const fontSize = mapZoomLevelToFontSize[zoomLevel.levelNumber];
  const lineHeight = fontSize - 2;

  context.font = `${fontSize}px Sacred`;
  context.textAlign = 'center';
  context.strokeStyle = 'black';
  context.lineWidth = fontSize > 21 ? 4 : 3; // text outline size
  context.fillStyle = 'white';

  if (!showRegions) {
    townLabelsData.forEach((townLabel) => {
      drawLabel({
        context,
        label: townLabel,
        mapCoordOffset,
        zoomScale: zoomLevel.scale,
        horizontalVisibilityMargin: TOWN_LABEL_HORIZONTAL_VISIBILITY_MARGIN,
        verticalVisibilityMargin: TOWN_LABEL_VERTICAL_VISIBILITY_MARGIN,
        lineHeight,
      });
    });
  } else {
    regionLabels.forEach((regionLabel) => {
      drawLabel({
        context,
        label: regionLabel,
        mapCoordOffset,
        zoomScale: zoomLevel.scale,
        horizontalVisibilityMargin: REGION_LABEL_VISIBILITY_MARGIN,
        verticalVisibilityMargin: REGION_LABEL_VISIBILITY_MARGIN,
        lineHeight,
      });
    });
  }
};

export default drawMapLabels;
