import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import debounce from 'lodash/debounce';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Popper from '@mui/material/Popper';

import ClickedMarkerContext from '../../../context/ClickedMarkerContext';
import FiltersContext from '../../../context/FiltersContext';
import useFocusOnPoint from '../../../shared/useFocusOnPoint';
import type { Marker } from '../../../types';

import './SearchInput.scss';
import search from './search';
import getTextWithHighlight from './getTextWithHighlight';
import isNode from './isNode';
import { HIGHLIGHT_INDICATOR } from './constants';

interface SearchInputProps {
  className?: string;
}

const SearchInput = ({ className }: SearchInputProps) => {
  const { setFilters } = useContext(FiltersContext);
  const { setClickedMarker } = useContext(ClickedMarkerContext);

  const focusOnPoint = useFocusOnPoint();

  const inputRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<Array<Marker>>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const outsideClickListener = (event: MouseEvent) => {
      if (!isNode(event.target)) {
        return;
      }

      if (
        !dropdownRef.current?.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', outsideClickListener);

    return () => {
      document.removeEventListener('click', outsideClickListener);
    };
  }, []);

  const handleSearchChange = useCallback((phrase: string) => {
    const results = search(phrase);
    setSearchResults(results);
    setIsDropdownOpen(true);
  }, []);

  const debouncedHandleSearchChange = useMemo(
    () => debounce(handleSearchChange, 300),
    [handleSearchChange],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchValue(newValue);

    if (newValue.length >= 2) {
      debouncedHandleSearchChange(newValue);
    } else {
      setSearchResults([]);
      setIsDropdownOpen(false);
    }
  };

  const clearInput = () => {
    setSearchValue('');
  };

  const handleFocus = () => {
    if (searchValue.length >= 2) {
      setIsDropdownOpen(true);
    }
  };

  const handleMarkerSelect = (marker: Marker) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [marker.category]: true,
    }));
    setClickedMarker({
      ...marker,
      label: marker.label.replaceAll(HIGHLIGHT_INDICATOR, ''),
      description:
        marker.description?.replaceAll(HIGHLIGHT_INDICATOR, '') || null,
    });
    setIsDropdownOpen(false);
    focusOnPoint(marker);
  };

  return (
    <>
      <OutlinedInput
        ref={inputRef}
        className={`Search__Input ${className}`}
        value={searchValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder="Search"
        endAdornment={
          <>
            {searchValue && (
              <InputAdornment position="end">
                <ClearIcon
                  className="Search__ClearIcon"
                  onClick={clearInput}
                />
              </InputAdornment>
            )}
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          </>
        }
      />
      <Popper
        ref={dropdownRef}
        className="SearchDropdown__Container"
        open={isDropdownOpen}
        anchorEl={inputRef.current}
        disablePortal
        placement="bottom-start"
      >
        <ul className="SearchDropdown__List">
          {!searchResults.length && (
            <li className="SearchDropdown__Element">
              <span>No results</span>
            </li>
          )}
          {searchResults.map((marker) => (
            <li
              key={marker.id}
              className="SearchDropdown__Element"
              onClick={() => handleMarkerSelect(marker)}
            >
              <span
                className={`SearchDropdown__ElementIcon SearchDropdown__ElementIcon--${marker.category}`}
              />
              <span className="SearchDropdown__ElementLabel">
                {getTextWithHighlight(marker.label)}
              </span>
              {marker.description ? (
                <span className="SearchDropdown__ElementDescription">
                  {getTextWithHighlight(marker.description)}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </Popper>
    </>
  );
};

export default SearchInput;
