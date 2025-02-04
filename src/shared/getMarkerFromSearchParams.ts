import markersData from '../assets/markers.json';
import { CUSTOM_MARKER_SIZE } from '../components/map/constants';
import { MarkerCategories } from '../components/map/types';
import { MAP_WIDTH, MAP_HEIGHT } from '../constants';

const getMarkerFromSearchParams = () => {
  const searchParams = new URLSearchParams(window.location.search);

  const searchX = Number(searchParams.get('x'));
  const searchY = Number(searchParams.get('y'));

  const regularMarker = Object.entries(markersData)
    .flatMap(([category, { markers, filterLabel, size }]) =>
      markers.map((marker) => ({
        ...marker,
        category: category as MarkerCategories,
        categoryFilterLabel: filterLabel,
        size,
      })),
    )
    .find(({ x, y }) => x === searchX && y === searchY);

  if (
    !regularMarker &&
    searchX > 0 &&
    searchX < MAP_WIDTH &&
    searchY > 0 &&
    searchY < MAP_HEIGHT
  ) {
    return {
      id: 'custom',
      label: 'Your location',
      category: 'custom' as MarkerCategories,
      categoryFilterLabel: 'Custom location',
      description: null,
      x: searchX,
      y: searchY,
      z: 0,
      size: CUSTOM_MARKER_SIZE,
    };
  }

  return regularMarker;
};

export default getMarkerFromSearchParams;
