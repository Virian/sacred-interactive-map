import { useRef, useState, useCallback, Dispatch, SetStateAction } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import './App.scss';
import markersData from './assets/markers.json';
import Map from './components/map/Map';
import FiltersMenu from './components/filtersMenu/FiltersMenu';
import Footer from './components/footer/Footer';
import ZoomControls from './components/zoomControls/ZoomControls';
import ZoomContext from './context/ZoomContext';
import MapCoordOffsetContext from './context/MapCoordOffsetContext';
import FiltersContext from './context/FiltersContext';
import ClickedMarkerContext from './context/ClickedMarkerContext';
import {
  FILTER_CATEGORY_CAVES,
  MAP_WIDTH,
  MAP_HEIGHT,
  INITIAL_SCALE_LEVEL_WITH_MARKER_SELECTED,
  INITIAL_SCALE_LEVEL,
} from './constants';
import { Coords, Marker, ZoomLevel } from './types';
import getMarkerFromSearchParams from './shared/getMarkerFromSearchParams';
import getOffsetToCenterOnPoint from './shared/getOffsetToCenterOnPoint';

const theme = createTheme({
  cssVariables: true,
});

const OFFSET_TO_CENTER_MAP = {
  x: Math.max(
    0,
    MAP_WIDTH / 2 - (window.innerWidth * INITIAL_SCALE_LEVEL.scale) / 2,
  ),
  y: Math.max(
    0,
    MAP_HEIGHT / 2 - (window.innerHeight * INITIAL_SCALE_LEVEL.scale) / 2,
  ),
};

const App = () => {
  const [zoomLevel, setZoomLevelState] = useState(() => {
    const marker = getMarkerFromSearchParams();

    return marker
      ? INITIAL_SCALE_LEVEL_WITH_MARKER_SELECTED
      : INITIAL_SCALE_LEVEL;
  });
  // ref is used in the image `onload` function where want to draw the tile
  // only if the current zoom level is still the same as it was when we
  // started loading it
  const zoomLevelRef = useRef(zoomLevel);

  // this wrapper sets both state and ref to the same value
  const setZoomLevel: Dispatch<SetStateAction<ZoomLevel>> = useCallback(
    (newZoomLevelParam) => {
      if (typeof newZoomLevelParam === 'function') {
        setZoomLevelState((currentZoomLevel) => {
          const newZoomLevel = newZoomLevelParam(currentZoomLevel);
          zoomLevelRef.current = newZoomLevel;
          return newZoomLevel;
        });
        return;
      }

      setZoomLevelState(newZoomLevelParam);
      zoomLevelRef.current = newZoomLevelParam;
    },
    [],
  );

  const [mapCoordOffset, setMapCoordOffset] = useState<Coords>(() => {
    const marker = getMarkerFromSearchParams();

    if (marker) {
      // centering the screen on the marker
      return getOffsetToCenterOnPoint(
        marker,
        INITIAL_SCALE_LEVEL_WITH_MARKER_SELECTED.scale,
      );
    }

    return OFFSET_TO_CENTER_MAP;
  });

  const [filters, setFilters] = useState<Record<string, boolean>>(() => {
    const initialFilterCategories = Object.keys(markersData).filter(
      (category) => category !== FILTER_CATEGORY_CAVES,
    );
    const initialFilters = initialFilterCategories.reduce(
      (acc, category) => ({ ...acc, [category]: true }),
      {},
    );
    const marker = getMarkerFromSearchParams();

    return marker
      ? { ...initialFilters, [marker.category]: true }
      : initialFilters;
  });

  const [clickedMarker, setClickedMarker] = useState<Marker | null>(
    () => getMarkerFromSearchParams() || null,
  );

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <ZoomContext.Provider value={{ zoomLevel, setZoomLevel, zoomLevelRef }}>
          <MapCoordOffsetContext.Provider
            value={{ mapCoordOffset, setMapCoordOffset }}
          >
            <FiltersContext.Provider value={{ filters, setFilters }}>
              <ClickedMarkerContext.Provider
                value={{ clickedMarker, setClickedMarker }}
              >
                <FiltersMenu />
                <Map />
                <ZoomControls />
                <Footer />
              </ClickedMarkerContext.Provider>
            </FiltersContext.Provider>
          </MapCoordOffsetContext.Provider>
        </ZoomContext.Provider>
      </ThemeProvider>
    </div>
  );
};

export default App;
