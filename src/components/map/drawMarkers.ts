import { MutableRefObject } from 'react';
import sortBy from 'lodash/sortBy';

import markersData from '../../assets/markers.json';
import asyncForEach from '../../shared/asyncForEach';
import { Coords, Marker, MarkerCategories, ZoomLevel } from '../../types';

import { CustomMarker, LoadedMarkers } from './types';

// markers that are lower on the screen will be layered on top of those being
// higher in case they overlap
const sortedMarkersData = sortBy(
  Object.entries(markersData).flatMap(([category, data]) =>
    data.markers.map((marker) => ({
      ...marker,
      category: category as MarkerCategories,
      filterLabel: data.filterLabel,
      size: data.size,
    })),
  ),
  ['y', 'x'],
);

interface MarkerData {
  category: MarkerCategories;
  filterLabel: string;
  id: string;
  x: number;
  y: number;
  z: number;
  label: string;
  description: string | null;
  linkedMarkerId?: string;
  size: number;
}

interface DrawMarkersParams {
  context: CanvasRenderingContext2D;
  mapCoordOffset: Coords;
  zoomLevel: ZoomLevel;
  LoadedMarkersRef: MutableRefObject<LoadedMarkers>;
  filters: Record<string, boolean>;
  customMarker?: CustomMarker | null;
}

const drawMarkers = async ({
  context,
  mapCoordOffset,
  zoomLevel,
  LoadedMarkersRef,
  filters,
  customMarker,
}: DrawMarkersParams) => {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const drawnMarkers: Marker[] = [];

  const allMarkers: MarkerData[] = customMarker
    ? [
        ...sortedMarkersData,
        {
          ...customMarker,
          filterLabel: customMarker.categoryFilterLabel,
        },
      ]
    : sortedMarkersData;

  await asyncForEach(
    allMarkers,
    async ({
      id,
      x,
      y,
      z,
      label,
      category,
      description,
      filterLabel,
      linkedMarkerId,
      size,
    }) => {
      if (!filters[category] && category !== 'custom') {
        return;
      }

      const loadedMarker = LoadedMarkersRef.current[category];
      const shouldDrawMarker =
        mapCoordOffset.x - size * zoomLevel.scale < x && // checking left edge of the screen
        mapCoordOffset.x +
          window.innerWidth * zoomLevel.scale +
          size * zoomLevel.scale >
          x && // right edge
        mapCoordOffset.y - size * zoomLevel.scale < y && // top edge
        mapCoordOffset.y +
          window.innerHeight * zoomLevel.scale +
          size * zoomLevel.scale >
          y; // bottom edge

      if (shouldDrawMarker) {
        const markerScreenX =
          (x - mapCoordOffset.x) / zoomLevel.scale - size / 2;
        const markerScreenY =
          (y - mapCoordOffset.y) / zoomLevel.scale - size / 2;

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
          linkedMarkerId,
          size,
        });

        context.shadowColor = '#000';
        context.shadowBlur = 8;
        context.shadowOffsetX = 4;
        context.shadowOffsetY = 4;

        if (loadedMarker) {
          context.drawImage(
            loadedMarker,
            markerScreenX,
            markerScreenY,
            size,
            size,
          );
        } else {
          const img = new Image();
          img.src = (
            await import(`../../assets/icons/icon-${category}.webp`)
          ).default;
          img.onload = () => {
            LoadedMarkersRef.current[category] = img;

            context.drawImage(img, markerScreenX, markerScreenY, size, size);
          };
        }
      }
    },
  );

  return drawnMarkers;
};

export default drawMarkers;
