import { MutableRefObject } from 'react';

import iconsData from '../../assets/icons.json';

import { Coords, LoadedIcons, IconCategories } from './types';
import { ICON_SIZE } from './constants';

interface DrawIconsParams {
  context: CanvasRenderingContext2D;
  mapCoordOffset: Coords;
  scaleLevel: { scale: number; level: number };
  loadedIconsRef: MutableRefObject<LoadedIcons>;
  filters: Record<string, boolean>;
}

const drawIcons = ({
  context,
  mapCoordOffset,
  scaleLevel,
  loadedIconsRef,
  filters,
}: DrawIconsParams) => {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  Object.entries(iconsData).forEach(([category, data]) => {
    if (!filters[category]) {
      return;
    }

    const loadedIcon = loadedIconsRef.current[category as IconCategories];

    data.markers.forEach(({ x, y }) => {
      const shouldDrawIcon =
        mapCoordOffset.x - ICON_SIZE * scaleLevel.scale < x && // checking left edge of the screen
        mapCoordOffset.x +
          window.innerWidth * scaleLevel.scale +
          ICON_SIZE * scaleLevel.scale >
          x && // right edge
        mapCoordOffset.y - ICON_SIZE * scaleLevel.scale < y && // top edge
        mapCoordOffset.y +
          window.innerHeight * scaleLevel.scale +
          ICON_SIZE * scaleLevel.scale >
          y; // bottom edge

      if (shouldDrawIcon) {
        const iconScreenX =
          (x - mapCoordOffset.x) / scaleLevel.scale - ICON_SIZE / 2;
        const iconScreenY =
          (y - mapCoordOffset.y) / scaleLevel.scale - ICON_SIZE / 2;

        if (loadedIcon) {
          context.drawImage(
            loadedIcon,
            iconScreenX,
            iconScreenY,
            ICON_SIZE,
            ICON_SIZE
          );
        } else {
          const img = new Image();
          img.src = require(`../../assets/icons/icon-${category}.webp`).default;
          img.onload = () => {
            loadedIconsRef.current[category as IconCategories] = img;

            context.drawImage(
              img,
              iconScreenX,
              iconScreenY,
              ICON_SIZE,
              ICON_SIZE
            );
          };
        }
      }
    });
  });
};

export default drawIcons;
