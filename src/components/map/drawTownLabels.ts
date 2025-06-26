import townLabelsData from '../../assets/townLabels.json';
import type { Coords, ZoomLevel } from '../../types';
import sacredFontUrl from '../../assets/fonts/sacred.ttf';

let isFontLoaded = false;
async function loadFont() {
  const font = new FontFace('Sacred', `url(${sacredFontUrl})`, {
    style: 'normal',
    weight: '400',
  });
  await font.load();
  document.fonts.add(font);
}

const mapZoomLevelToFontSize: Record<number, number> = {
  1: 17,
  4: 20,
  6: 22,
  8: 24,
  9: 26,
  10: 28,
  11: 32,
  12: 40,
};

// Labels don't have any predefined size. This is the maximum distance between
// a map edge and label origin where label is drawn on canvas. If the
// distance is larger and the label origin is not visible on screen, it won't
// be drawn at all.
const LABEL_HORIZONTAL_VISIBILITY_MARGIN = 180;
const LABEL_VERTICAL_VISIBILITY_MARGIN = 100;

interface DrawTownLabelsParams {
  context: CanvasRenderingContext2D;
  shouldDisplayLabels: boolean;
  mapCoordOffset: Coords;
  zoomLevel: ZoomLevel;
}

const drawTownLabels = async ({
  context,
  shouldDisplayLabels,
  mapCoordOffset,
  zoomLevel,
}: DrawTownLabelsParams) => {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  if (!shouldDisplayLabels) {
    return;
  }

  if (!isFontLoaded) {
    await loadFont();
    isFontLoaded = true;
  }

  const fontSize = mapZoomLevelToFontSize[zoomLevel.levelNumber];
  const lineHeight = fontSize - 2;

  // TODO: decide if they should be visible by default
  context.font = `${fontSize}px Sacred`;
  context.textAlign = 'center';
  context.strokeStyle = 'black';
  context.lineWidth = fontSize > 21 ? 4 : 3; // text outline size
  context.fillStyle = 'white';

  townLabelsData.forEach((townLabel) => {
    const shouldDrawLabel =
      mapCoordOffset.x - LABEL_HORIZONTAL_VISIBILITY_MARGIN * zoomLevel.scale <
        townLabel.x && // checking left edge of the screen
      mapCoordOffset.x +
        window.innerWidth * zoomLevel.scale +
        LABEL_HORIZONTAL_VISIBILITY_MARGIN * zoomLevel.scale >
        townLabel.x && // right edge
      mapCoordOffset.y - LABEL_VERTICAL_VISIBILITY_MARGIN * zoomLevel.scale <
        townLabel.y && // top edge
      mapCoordOffset.y +
        window.innerHeight * zoomLevel.scale +
        LABEL_VERTICAL_VISIBILITY_MARGIN * zoomLevel.scale >
        townLabel.y; // bottom edge

    if (!shouldDrawLabel) {
      return;
    }

    const labelScreenX = (townLabel.x - mapCoordOffset.x) / zoomLevel.scale;
    const labelScreenY = (townLabel.y - mapCoordOffset.y) / zoomLevel.scale;
    const labelLines = townLabel.text.split('\n');

    labelLines.forEach((labelPart, index) => {
      context.strokeText(
        labelPart,
        labelScreenX,
        labelScreenY + lineHeight * index,
      );
      context.fillText(
        labelPart,
        labelScreenX,
        labelScreenY + lineHeight * index,
      );
    });
  });
};

export default drawTownLabels;
