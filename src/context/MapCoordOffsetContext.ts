import { createContext, Dispatch, SetStateAction } from 'react';

import { Coords } from '../types';

interface MapCoordOffsetContextProps {
  mapCoordOffset: Coords;
  setMapCoordOffset: Dispatch<SetStateAction<Coords>>;
}

const MapCoordOffsetContext = createContext<MapCoordOffsetContextProps>({
  mapCoordOffset: { x: 0, y: 0 },
  setMapCoordOffset: () => {},
});

export default MapCoordOffsetContext;
