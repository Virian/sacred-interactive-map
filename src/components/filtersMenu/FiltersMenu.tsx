import { useState, useCallback, useContext } from 'react';
import Button from '@mui/material/Button';

import markersData from '../../assets/markers.json';
import FiltersContext from '../../context/FiltersContext';
import OptionsContext from '../../context/OptionsContext';
import Checkbox from '../checkbox/Checkbox';

import './FiltersMenu.scss';
import SearchInput from './searchInput/SearchInput';

const FiltersMenu = () => {
  const { filters, setFilters } = useContext(FiltersContext);
  const { options, setOptions } = useContext(OptionsContext);

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
    [setFilters],
  );

  const setAllFilters = useCallback(
    (shouldEnable: boolean) => {
      const newFilters = Object.keys(markersData).reduce(
        (acc, category) => ({
          ...acc,
          [category]: shouldEnable,
        }),
        {},
      );
      setFilters(newFilters);
    },
    [setFilters],
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
          <Button
            variant="contained"
            onClick={() => setAllFilters(true)}
          >
            show all
          </Button>
          <Button
            variant="contained"
            onClick={() => setAllFilters(false)}
          >
            hide all
          </Button>
        </div>
        <div className="FiltersMenu__Separator" />
        <SearchInput className="FiltersMenu__Search" />
        <div className="FiltersMenu__Filters">
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
        <div className="FiltersMenu__Separator" />
        <Checkbox
          className="FiltersMenu__Checkbox"
          checked={options.shouldDisplayLabels}
          onChange={(newValue) =>
            setOptions((currentOptions) => ({
              ...currentOptions,
              shouldDisplayLabels: newValue,
            }))
          }
        >
          map labels
        </Checkbox>
      </div>
    </div>
  );
};

export default FiltersMenu;
