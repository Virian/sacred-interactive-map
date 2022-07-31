import { createContext, Dispatch, SetStateAction } from 'react';

interface FiltersContextProps {
  filters: Record<string, boolean>;
  setFilters: Dispatch<SetStateAction<Record<string, boolean>>>;
}

const FiltersContext = createContext<FiltersContextProps>({
  filters: {},
  setFilters: () => {},
});

export default FiltersContext;
