import { MutableRefObject } from 'react';
import sortBy from 'lodash/sortBy';

import markersData from '../../assets/markers.json';
import { Coords, ZoomLevel } from '../../types';

import { Marker, LoadedMarkers, MarkerCategories } from './types';
import { MARKER_SIZE } from './constants';

// markers that are lower on the screen will be layered on top of those being
// higher in case they overlap
const sortedMarkersData = sortBy(
  Object.entries(markersData).flatMap(([category, data]) =>
    data.markers.map((marker) => ({
      ...marker,
      category: category as MarkerCategories,
      filterLabel: data.filterLabel,
    }))
  ),
  ['y', 'x']
);

interface DrawMarkersParams {
  context: CanvasRenderingContext2D;
  mapCoordOffset: Coords;
  zoomLevel: ZoomLevel;
  LoadedMarkersRef: MutableRefObject<LoadedMarkers>;
  filters: Record<string, boolean>;
  customMarker?: Marker | null;
}

const drawMarkers = ({
  context,
  mapCoordOffset,
  zoomLevel,
  LoadedMarkersRef,
  filters,
  customMarker,
}: DrawMarkersParams) => {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const drawnMarkers: Marker[] = [];

  (customMarker
    ? sortedMarkersData.concat({
        ...customMarker,
        filterLabel: customMarker.categoryFilterLabel,
      })
    : sortedMarkersData
  ).forEach(({ id, x, y, z, label, category, description, filterLabel }) => {
    if (!filters[category] && category !== 'custom') {
      return;
    }

    const loadedMarker = LoadedMarkersRef.current[category];
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

      drawnMarkers.push({
        id,
        x,
        y,
        z,
        screenX: markerScreenX,
        screenY: markerScreenY,
        label,
        description,
        category,
        categoryFilterLabel: filterLabel,
      });

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
          LoadedMarkersRef.current[category] = img;

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

  return drawnMarkers;
};

export default drawMarkers;
