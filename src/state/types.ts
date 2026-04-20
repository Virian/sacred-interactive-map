import type { MutableRefObject } from 'react';

import type { Coords, ZoomLevel } from '../types';

import { MapStateActions } from './constants';

export interface MapState {
  coordOffset: Coords;
  zoomLevel: ZoomLevel;
  zoomLevelRef?: MutableRefObject<ZoomLevel>;
  coordOffsetRef?: MutableRefObject<Coords>;
}

export type MapStateAction =
  | {
      type: typeof MapStateActions.MOVE_MAP;
      payload: { newTargetPosition: Coords; moveDelta: Coords };
    }
  | { type: typeof MapStateActions.FOCUS_ON_POINT; payload: Coords }
  | {
      type: typeof MapStateActions.SET_ZOOM_LEVEL_REF;
      payload: MutableRefObject<ZoomLevel>;
    }
  | {
      type: typeof MapStateActions.SET_COORD_OFFSET_REF;
      payload: MutableRefObject<Coords>;
    }
  // payload for zoom in/out is the point to center the zoom on, which is used
  // to calculate the new coord offset, so that the point stays in the same
  // position on the screen after zoom
  | { type: typeof MapStateActions.ZOOM_IN; payload: Coords }
  | { type: typeof MapStateActions.ZOOM_OUT; payload: Coords };
