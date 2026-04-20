import { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import './App.scss';
import markersData from './assets/markers.json';
import Map from './components/map/Map';
import FiltersMenu from './components/filtersMenu/FiltersMenu';
import Footer from './components/footer/Footer';
import ZoomControls from './components/zoomControls/ZoomControls';
import MapStateContext from './context/MapStateContext';
import FiltersContext from './context/FiltersContext';
import OptionsContext from './context/OptionsContext';
import ClickedMarkerContext from './context/ClickedMarkerContext';
import { FILTER_CATEGORY_CAVES } from './constants';
import type { Marker, Options } from './types';
import getMarkerFromSearchParams from './shared/getMarkerFromSearchParams';
import useMapState from './state/useMapState';

const theme = createTheme({
  cssVariables: true,
});

const App = () => {
  const { state: mapState, dispatch: mapStateDispatch } = useMapState();

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

  const [options, setOptions] = useState<Options>({
    shouldDisplayLabels: false,
    showRegions: false,
  });

  const [clickedMarker, setClickedMarker] = useState<Marker | null>(
    () => getMarkerFromSearchParams() || null,
  );

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <MapStateContext.Provider
          value={{ state: mapState, dispatch: mapStateDispatch }}
        >
          <OptionsContext.Provider value={{ options, setOptions }}>
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
          </OptionsContext.Provider>
        </MapStateContext.Provider>
      </ThemeProvider>
    </div>
  );
};

export default App;
