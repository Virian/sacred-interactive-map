import React, { useState, useCallback, Dispatch, SetStateAction } from 'react';

import './FiltersMenu.scss';
import iconsData from '../../assets/icons.json';

interface FiltersMenuProps {
  filters: Record<string, boolean>;
  setFilters: Dispatch<SetStateAction<Record<string, boolean>>>;
}

const FiltersMenu = ({ filters, setFilters }: FiltersMenuProps) => {
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
        {Object.entries(iconsData).map(([category, data]) => (
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
