import { MutableRefObject } from 'react';

import markersData from '../../assets/markers.json';

import { Coords, LoadedMarkers, MarkerCategories } from './types';
import { MARKER_SIZE } from './constants';

interface DrawMarkersParams {
  context: CanvasRenderingContext2D;
  mapCoordOffset: Coords;
  scaleLevel: { scale: number; level: number };
  LoadedMarkersRef: MutableRefObject<LoadedMarkers>;
  filters: Record<string, boolean>;
}

const drawMarkers = ({
  context,
  mapCoordOffset,
  scaleLevel,
  LoadedMarkersRef,
  filters,
}: DrawMarkersParams) => {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  Object.entries(markersData).forEach(([category, data]) => {
    if (!filters[category]) {
      return;
    }

    const loadedMarker = LoadedMarkersRef.current[category as MarkerCategories];

    data.markers.forEach(({ x, y }) => {
      const shouldDrawMarker =
        mapCoordOffset.x - MARKER_SIZE * scaleLevel.scale < x && // checking left edge of the screen
        mapCoordOffset.x +
          window.innerWidth * scaleLevel.scale +
          MARKER_SIZE * scaleLevel.scale >
          x && // right edge
        mapCoordOffset.y - MARKER_SIZE * scaleLevel.scale < y && // top edge
        mapCoordOffset.y +
          window.innerHeight * scaleLevel.scale +
          MARKER_SIZE * scaleLevel.scale >
          y; // bottom edge

      if (shouldDrawMarker) {
        const markerScreenX =
          (x - mapCoordOffset.x) / scaleLevel.scale - MARKER_SIZE / 2;
        const markerScreenY =
          (y - mapCoordOffset.y) / scaleLevel.scale - MARKER_SIZE / 2;

        if (loadedMarker) {
          context.drawImage(
            loadedMarker,
            markerScreenX,
            markerScreenY,
            MARKER_SIZE,
            MARKER_SIZE
          );
        } else {
          const img = new Image();
          img.src = require(`../../assets/icons/icon-${category}.webp`).default;
          img.onload = () => {
            LoadedMarkersRef.current[category as MarkerCategories] = img;

            context.drawImage(
              img,
              markerScreenX,
              markerScreenY,
              MARKER_SIZE,
              MARKER_SIZE
            );
          };
        }
      }
    });
  });
};

export default drawMarkers;
