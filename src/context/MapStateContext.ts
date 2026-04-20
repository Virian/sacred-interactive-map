import { createContext, Dispatch } from 'react';

import { initialMapState } from '../state/initialState';
import type { MapState, MapStateAction } from '../state/types';

interface MapStateContextProps {
  state: MapState;
  dispatch: Dispatch<MapStateAction>;
}

const MapStateContext = createContext<MapStateContextProps>({
  state: initialMapState,
  dispatch: () => null,
});

export default MapStateContext;
