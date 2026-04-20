import {
  INITIAL_SCALE_LEVEL,
  INITIAL_SCALE_LEVEL_WITH_MARKER_SELECTED,
} from '../constants';
import getMarkerFromSearchParams from '../shared/getMarkerFromSearchParams';
import getOffsetToCenterOnPoint from '../shared/getOffsetToCenterOnPoint';

import { OFFSET_TO_CENTER_MAP } from './constants';
import type { MapState } from './types';

export const initialMapState: MapState = {
  coordOffset: { x: 0, y: 0 },
  zoomLevel: INITIAL_SCALE_LEVEL,
};

export const initMapState = (): MapState => {
  const marker = getMarkerFromSearchParams();

  const coordOffset = marker
    ? getOffsetToCenterOnPoint(
        marker,
        INITIAL_SCALE_LEVEL_WITH_MARKER_SELECTED.scale,
      )
    : OFFSET_TO_CENTER_MAP;

  const zoomLevel = marker
    ? INITIAL_SCALE_LEVEL_WITH_MARKER_SELECTED
    : INITIAL_SCALE_LEVEL;

  return {
    coordOffset,
    zoomLevel,
  };
};
