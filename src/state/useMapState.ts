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
  // only if the current zoom level is still the same as it was when we
  // started loading it
  const zoomLevelRef = useRef(state.zoomLevel);

  useEffect(() => {
    dispatch({
      type: MapStateActions.SET_ZOOM_LEVEL_REF,
      payload: zoomLevelRef,
    });
  }, []);

  return { state, dispatch };
};

export default useMapState;
