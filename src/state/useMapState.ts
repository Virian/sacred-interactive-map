import { useEffect, useReducer, useRef } from 'react';

import { initialMapState, initMapState } from './initialState';
import { MapStateActions } from './constants';
import mapStateReducer from './reducer';

const useMapState = () => {
  const [state, dispatch] = useReducer(
    mapStateReducer,
    initialMapState,
    initMapState,
  );

  // ref is used in the image `onload` function where want to draw the tile
  // only if the current zoom level and coord offset is still the same as it
  // was when we started loading it
  const zoomLevelRef = useRef(state.zoomLevel);
  const coordOffsetRef = useRef(state.coordOffset);

  useEffect(() => {
    dispatch({
      type: MapStateActions.SET_ZOOM_LEVEL_REF,
      payload: zoomLevelRef,
    });
    dispatch({
      type: MapStateActions.SET_COORD_OFFSET_REF,
      payload: coordOffsetRef,
    });
  }, []);

  return { state, dispatch };
};

export default useMapState;
