import React, { useState, useCallback, useContext } from 'react';

import markersData from '../../assets/markers.json';
import FiltersContext from '../../context/FiltersContext';

import './FiltersMenu.scss';

const FiltersMenu = () => {
  const { filters, setFilters } = useContext(FiltersContext);

  const [isHidden, setIsHidden] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsHidden((currentValue) => !currentValue);
  }, []);

  const toggleFilter = useCallback(
    (filterName: string) =>
      setFilters((currentFilters) => ({
        ...currentFilters,
        [filterName]: !currentFilters[filterName],
      })),
    [setFilters]
  );

  const setAllFilters = useCallback(
    (shouldEnable: boolean) => {
      const newFilters = Object.keys(markersData).reduce(
        (acc, category) => ({
          ...acc,
          [category]: shouldEnable,
        }),
        {}
      );
      setFilters(newFilters);
    },
    [setFilters]
  );

  return (
    <div className={`FiltersMenu ${isHidden ? 'isHidden' : ''}`}>
      <div
        className="FiltersMenu__ArrowContainer"
        onClick={toggleMenu}
      >
        <span className={`FiltersMenu__Arrow ${isHidden ? 'isHidden' : ''}`} />
      </div>
      <div className="FiltersMenu__Container">
        <span className="FiltersMenu__Logo" />
        <h1 className="FiltersMenu__Header">Interactive Map</h1>
        <div className="FiltersMenu__Separator" />
        <div className="FiltersMenu__Buttons">
          <button
            className="FiltersMenu__Button"
            onClick={() => setAllFilters(true)}
          >
            show all
          </button>
          <button
            className="FiltersMenu__Button"
            onClick={() => setAllFilters(false)}
          >
            hide all
          </button>
        </div>
        <div className="FiltersMenu__Separator" />
        {Object.entries(markersData).map(([category, data]) => (
          <div
            key={category}
            className={`Filter ${!filters[category] ? 'Filter--Disabled' : ''}`}
            onClick={() => toggleFilter(category)}
          >
            <span className={`Filter__Icon Filter__Icon--${category}`} />
            <span className="Filter__Text">{data.filterLabel}</span>
            <span className="Filter__Count">{data.markers.length}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FiltersMenu;
