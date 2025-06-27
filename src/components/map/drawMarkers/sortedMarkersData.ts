import sortBy from 'lodash/sortBy';

import markersData from '../../../assets/markers.json';
import type { MarkerCategories } from '../../../types';

// markers that are lower on the screen will be layered on top of those being
// higher in case they overlap
const sortedMarkersData = sortBy(
  Object.entries(markersData).flatMap(([category, data]) =>
    data.markers.map((marker) => ({
      ...marker,
      category: category as MarkerCategories,
      filterLabel: data.filterLabel,
      size: data.size,
    })),
  ),
  ['y', 'x'],
);

export default sortedMarkersData;
