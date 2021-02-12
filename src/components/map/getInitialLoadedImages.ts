import range from 'lodash/range';

import { HORIZONTAL_TILES } from './constants';
import { LoadedImages } from './types';

const getInitialLoadedImages = (): LoadedImages => {
  return range(HORIZONTAL_TILES).reduce((acc, xCoord) => ({
    ...acc,
    [xCoord]: [],
  }), {});
}

export default getInitialLoadedImages;
