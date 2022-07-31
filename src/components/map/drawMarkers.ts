import { MutableRefObject } from 'react';

import markersData from '../../assets/markers.json';

import { Coords, Marker, LoadedMarkers, MarkerCategories } from './types';
import { MARKER_SIZE } from './constants';

interface DrawMarkersParams {
  context: CanvasRenderingContext2D;
  mapCoordOffset: Coords;
  zoomLevel: { scale: number; levelNumber: number };
  LoadedMarkersRef: MutableRefObject<LoadedMarkers>;
  filters: Record<string, boolean>;
}

const drawMarkers = ({
  context,
  mapCoordOffset,
  zoomLevel,
  LoadedMarkersRef,
  filters,
}: DrawMarkersParams) => {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const drawnMarkers: Marker[] = [];

  Object.entries(markersData).forEach(([category, data]) => {
    if (!filters[category]) {
      return;
    }

    const loadedMarker = LoadedMarkersRef.current[category as MarkerCategories];

    data.markers.forEach(({ x, y, label }) => {
      const shouldDrawMarker =
        mapCoordOffset.x - MARKER_SIZE * zoomLevel.scale < x && // checking left edge of the screen
        mapCoordOffset.x +
          window.innerWidth * zoomLevel.scale +
          MARKER_SIZE * zoomLevel.scale >
          x && // right edge
        mapCoordOffset.y - MARKER_SIZE * zoomLevel.scale < y && // top edge
        mapCoordOffset.y +
          window.innerHeight * zoomLevel.scale +
          MARKER_SIZE * zoomLevel.scale >
          y; // bottom edge

      if (shouldDrawMarker) {
        const markerScreenX =
          (x - mapCoordOffset.x) / zoomLevel.scale - MARKER_SIZE / 2;
        const markerScreenY =
          (y - mapCoordOffset.y) / zoomLevel.scale - MARKER_SIZE / 2;

        drawnMarkers.push({ x: markerScreenX, y: markerScreenY, label });

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

  return drawnMarkers;
};

export default drawMarkers;
