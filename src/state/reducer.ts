import { MAP_HEIGHT, MAP_SCALE_LEVELS, MAP_WIDTH } from '../constants';
import getOffsetToCenterOnPoint from '../shared/getOffsetToCenterOnPoint';

import { MapStateActions } from './constants';
import type { MapState, MapStateAction } from './types';

const reducer = (state: MapState, { type, payload }: MapStateAction) => {
  switch (type) {
    case MapStateActions.MOVE_MAP: {
      const xDelta = payload.moveDelta.x - payload.newTargetPosition.x;
      const yDelta = payload.moveDelta.y - payload.newTargetPosition.y;

      let newXPos = state.coordOffset.x + xDelta * state.zoomLevel.scale;
      let newYPos = state.coordOffset.y + yDelta * state.zoomLevel.scale;

      if (newXPos < 0) {
        newXPos = 0;
      } else if (
        newXPos >
        MAP_WIDTH - window.innerWidth * state.zoomLevel.scale
      ) {
        newXPos = MAP_WIDTH - window.innerWidth * state.zoomLevel.scale;
      }

      if (newYPos < 0) {
        newYPos = 0;
      } else if (
        newYPos >
        MAP_HEIGHT - window.innerHeight * state.zoomLevel.scale
      ) {
        newYPos = MAP_HEIGHT - window.innerHeight * state.zoomLevel.scale;
      }

      const newCoordOffset = { x: newXPos, y: newYPos };

      if (state.coordOffsetRef?.current) {
        state.coordOffsetRef.current = newCoordOffset;
      }

      return {
        ...state,
        coordOffset: newCoordOffset,
      };
    }
    case MapStateActions.FOCUS_ON_POINT: {
      let newZoomLevel = state.zoomLevel;
      if (state.zoomLevel.scale > 3) {
        newZoomLevel =
          // findLast doesn't work, therefore reversing first
          [...MAP_SCALE_LEVELS].reverse().find(({ scale }) => scale <= 3) ||
          newZoomLevel;
      }

      const newCoordOffset = getOffsetToCenterOnPoint(
        payload,
        newZoomLevel.scale,
      );

      if (state.zoomLevelRef?.current) {
        state.zoomLevelRef.current = newZoomLevel;
      }
      if (state.coordOffsetRef?.current) {
        state.coordOffsetRef.current = newCoordOffset;
      }

      return {
        ...state,
        zoomLevel: newZoomLevel,
        coordOffset: newCoordOffset,
      };
    }
    case MapStateActions.SET_ZOOM_LEVEL_REF:
      return { ...state, zoomLevelRef: payload };
    case MapStateActions.SET_COORD_OFFSET_REF:
      return { ...state, coordOffsetRef: payload };
    case MapStateActions.ZOOM_IN: {
      const currentIndex = MAP_SCALE_LEVELS.indexOf(state.zoomLevel);
      let newZoomLevel = state.zoomLevel;
      if (currentIndex !== 0) {
        newZoomLevel = MAP_SCALE_LEVELS[currentIndex - 1];
      }

      if (state.zoomLevel.levelNumber === newZoomLevel.levelNumber) {
        return state;
      }

      const currentPointCoords = {
        x: state.coordOffset.x + payload.x * state.zoomLevel.scale,
        y: state.coordOffset.y + payload.y * state.zoomLevel.scale,
      };

      const newCoordOffset = {
        x: Math.max(
          0,
          Math.min(
            currentPointCoords.x - payload.x * newZoomLevel.scale,
            MAP_WIDTH - window.innerWidth * newZoomLevel.scale,
          ),
        ),
        y: Math.max(
          0,
          Math.min(
            currentPointCoords.y - payload.y * newZoomLevel.scale,
            MAP_HEIGHT - window.innerHeight * newZoomLevel.scale,
          ),
        ),
      };

      if (state.zoomLevelRef?.current) {
        state.zoomLevelRef.current = newZoomLevel;
      }
      if (state.coordOffsetRef?.current) {
        state.coordOffsetRef.current = newCoordOffset;
      }

      return {
        ...state,
        coordOffset: newCoordOffset,
        zoomLevel: newZoomLevel,
      };
    }
    case MapStateActions.ZOOM_OUT: {
      const currentIndex = MAP_SCALE_LEVELS.indexOf(state.zoomLevel);
      let newZoomLevel = state.zoomLevel;
      if (currentIndex !== MAP_SCALE_LEVELS.length - 1) {
        newZoomLevel = MAP_SCALE_LEVELS[currentIndex + 1];
      }

      if (state.zoomLevel.levelNumber === newZoomLevel.levelNumber) {
        return state;
      }

      const currentPointCoords = {
        x: state.coordOffset.x + payload.x * state.zoomLevel.scale,
        y: state.coordOffset.y + payload.y * state.zoomLevel.scale,
      };

      const newCoordOffset = {
        x: Math.max(
          0,
          Math.min(
            currentPointCoords.x - payload.x * newZoomLevel.scale,
            MAP_WIDTH - window.innerWidth * newZoomLevel.scale,
          ),
        ),
        y: Math.max(
          0,
          Math.min(
            currentPointCoords.y - payload.y * newZoomLevel.scale,
            MAP_HEIGHT - window.innerHeight * newZoomLevel.scale,
          ),
        ),
      };

      if (state.zoomLevelRef?.current) {
        state.zoomLevelRef.current = newZoomLevel;
      }
      if (state.coordOffsetRef?.current) {
        state.coordOffsetRef.current = newCoordOffset;
      }

      return {
        ...state,
        coordOffset: newCoordOffset,
        zoomLevel: newZoomLevel,
      };
    }
    default:
      return state;
  }
};

export default reducer;
