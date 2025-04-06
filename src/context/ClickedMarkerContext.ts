import { createContext, Dispatch, SetStateAction } from 'react';

import { Marker } from '../types';

interface ClickedMarkerContextProps {
  clickedMarker: Marker | null;
  setClickedMarker: Dispatch<SetStateAction<Marker | null>>;
}

const ClickedMarkerContext = createContext<ClickedMarkerContextProps>({
  clickedMarker: null,
  setClickedMarker: () => {},
});

export default ClickedMarkerContext;
