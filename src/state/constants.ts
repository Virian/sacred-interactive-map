import { INITIAL_SCALE_LEVEL, MAP_HEIGHT, MAP_WIDTH } from '../constants';

export const OFFSET_TO_CENTER_MAP = {
  x: Math.max(
    0,
    MAP_WIDTH / 2 - (window.innerWidth * INITIAL_SCALE_LEVEL.scale) / 2,
  ),
  y: Math.max(
    0,
    MAP_HEIGHT / 2 - (window.innerHeight * INITIAL_SCALE_LEVEL.scale) / 2,
  ),
};

export const MapStateActions = {
  MOVE_MAP: 'MOVE_MAP',
  FOCUS_ON_POINT: 'FOCUS_ON_POINT',
  SET_ZOOM_LEVEL_REF: 'SET_ZOOM_LEVEL_REF',
  ZOOM_IN: 'ZOOM_IN',
  ZOOM_OUT: 'ZOOM_OUT',
} as const;
