import { MutableRefObject } from 'react';

import asyncForEach from '../../../shared/asyncForEach';
import type {
  Coords,
  Marker,
  MarkerCategories,
  ZoomLevel,
} from '../../../types';

import type { CustomMarker, LoadedMarkers } from '../types';
import drawImageOutlineBase from './drawImageOutlineBase';
import mapZoomLevelToOutlineThickness from './mapZoomLevelToOutlineThickness';
import sortedMarkersData from './sortedMarkersData';

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
  isFromExpansion?: boolean;
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
      isFromExpansion,
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

      if (!shouldDrawMarker) {
        return;
      }

      const markerScreenX = (x - mapCoordOffset.x) / zoomLevel.scale - size / 2;
      const markerScreenY = (y - mapCoordOffset.y) / zoomLevel.scale - size / 2;
      const thickness =
        mapZoomLevelToOutlineThickness[zoomLevel.levelNumber][category];

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
        isFromExpansion,
      });

      if (loadedMarker) {
        drawImageOutlineBase(
          context,
          loadedMarker,
          markerScreenX,
          markerScreenY,
          thickness,
        );
      } else {
        const img = new Image();
        img.src = (
          await import(`../../assets/icons/icon-${category}.webp`)
        ).default;
        return new Promise((resolve) => {
          img.onload = () => {
            LoadedMarkersRef.current[category] = img;

            drawImageOutlineBase(
              context,
              img,
              markerScreenX,
              markerScreenY,
              thickness,
            );
            resolve(img);
          };
        });
      }
    },
  );

  // make outlines solid color
  context.globalCompositeOperation = 'source-in';
  context.fillStyle = 'black';
  context.fillRect(0, 0, window.innerWidth, window.innerHeight);

  // draw markers in normal mode
  context.globalCompositeOperation = 'source-over';
  await asyncForEach(
    drawnMarkers,
    async ({ category, screenX, screenY, size }) => {
      const loadedMarker = LoadedMarkersRef.current[category];

      if (
        screenX === null ||
        screenX === undefined ||
        screenY === null ||
        screenY === undefined ||
        !loadedMarker
      ) {
        // just for TS to not complain and as a safeguard but shouldn't happen
        return;
      }

      context.drawImage(loadedMarker, screenX, screenY, size, size);
    },
  );
  return drawnMarkers;
};

export default drawMarkers;
