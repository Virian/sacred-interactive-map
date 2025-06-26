import { createContext, Dispatch, SetStateAction } from 'react';

import type { Options } from '../types';

interface OptionsContextProps {
  options: Options;
  setOptions: Dispatch<SetStateAction<Options>>;
}

const OptionsContext = createContext<OptionsContextProps>({
  options: { shouldDisplayLabels: false },
  setOptions: () => {},
});

export default OptionsContext;
