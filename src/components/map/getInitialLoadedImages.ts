import range from 'lodash/range';

import { HORIZONTAL_TILES, MAP_SCALE_LEVELS } from './constants';
import { LoadedImages } from './types';

const getInitialLoadedImages = (): LoadedImages =>
  Object.values(MAP_SCALE_LEVELS).reduce(
    (acc, { levelNumber, scale }) => ({
      ...acc,
      [levelNumber]: range(Math.ceil(HORIZONTAL_TILES / scale)).reduce(
        (acc, xCoord) => ({
          ...acc,
          [xCoord]: [],
        }),
        {}
      ),
    }),
    {}
  );

export default getInitialLoadedImages;
