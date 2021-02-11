import { range } from 'lodash-es';

import { HORIZONTAL_TILES } from './constants';
import { LoadedImages } from './types';

const getInitialLoadedImages = (): LoadedImages => {
  return range(HORIZONTAL_TILES).reduce((acc, xCoord) => ({
    ...acc,
    [xCoord]: [],
  }), {});
}

export default getInitialLoadedImages;
