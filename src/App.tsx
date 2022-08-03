import React, { useState } from 'react';

import './App.scss';
import Map from './components/map/Map';
import FiltersMenu from './components/filtersMenu/FiltersMenu';
import Footer from './components/footer/Footer';
import ZoomControls from './components/zoomControls/ZoomControls';
import ZoomContext from './context/ZoomContext';
import MapCoordOffsetContext from './context/MapCoordOffsetContext';
import FiltersContext from './context/FiltersContext';
import {
  MAP_WIDTH,
  MAP_HEIGHT,
  INITIAL_SCALE_LEVEL_WITH_MARKER_SELECTED,
  INITIAL_SCALE_LEVEL,
} from './constants';
import { Coords } from './types';
import getMarkerFromSearchParams from './shared/getMarkerFromSearchParams';
import getOffsetToCenterOnPoint from './shared/getOffsetToCenterOnPoint';

const OFFSET_TO_CENTER_MAP = {
  x: Math.max(
    0,
    MAP_WIDTH / 2 - (window.innerWidth * INITIAL_SCALE_LEVEL.scale) / 2
  ),
  y: Math.max(
    0,
    MAP_HEIGHT / 2 - (window.innerHeight * INITIAL_SCALE_LEVEL.scale) / 2
  ),
};

const App = () => {
  const [zoomLevel, setZoomLevel] = useState(() => {
    const marker = getMarkerFromSearchParams();

    return marker
      ? INITIAL_SCALE_LEVEL_WITH_MARKER_SELECTED
      : INITIAL_SCALE_LEVEL;
  });

  const [mapCoordOffset, setMapCoordOffset] = useState<Coords>(() => {
    const marker = getMarkerFromSearchParams();

    if (marker) {
      // centering the screen on the marker
      return getOffsetToCenterOnPoint(
        marker,
        INITIAL_SCALE_LEVEL_WITH_MARKER_SELECTED.scale
      );
    }

    return OFFSET_TO_CENTER_MAP;
  });

  const [filters, setFilters] = useState<Record<string, boolean>>(() => {
    const marker = getMarkerFromSearchParams();

    return marker ? { [marker.category]: true } : {};
  });

  return (
    <div className="App">
      <ZoomContext.Provider value={{ zoomLevel, setZoomLevel }}>
        <MapCoordOffsetContext.Provider
          value={{ mapCoordOffset, setMapCoordOffset }}
        >
          <FiltersContext.Provider value={{ filters, setFilters }}>
            <FiltersMenu />
            <Map />
            <ZoomControls />
            <Footer />
          </FiltersContext.Provider>
        </MapCoordOffsetContext.Provider>
      </ZoomContext.Provider>
    </div>
  );
};

export default App;
