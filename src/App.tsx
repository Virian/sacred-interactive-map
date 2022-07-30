import React, { useState } from 'react';

import Map from './components/map/Map';
import FiltersMenu from './components/filtersMenu/FiltersMenu';
import Footer from './components/footer/Footer';
import './assets/css/variables.css';
import './App.css';

const App = () => {
  const [filters, setFilters] = useState<Record<string, boolean>>({});

  return (
    <div className="App">
      <FiltersMenu
        filters={filters}
        setFilters={setFilters}
      />
      <Map filters={filters} />
      <Footer />
    </div>
  );
};

export default App;
