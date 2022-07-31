import { createContext, Dispatch, SetStateAction } from 'react';

import { ZoomLevel } from '../types';
import { INITIAL_SCALE_LEVEL } from '../constants';

interface ZoomContextProps {
  zoomLevel: ZoomLevel;
  setZoomLevel: Dispatch<SetStateAction<ZoomLevel>>;
}

const ZoomContext = createContext<ZoomContextProps>({
  zoomLevel: INITIAL_SCALE_LEVEL,
  setZoomLevel: () => {},
});

export default ZoomContext;
