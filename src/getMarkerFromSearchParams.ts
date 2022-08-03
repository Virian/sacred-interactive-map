import markersData from './assets/markers.json';
import { MarkerCategories } from './components/map/types';
import { MAP_WIDTH, MAP_HEIGHT } from './constants';

const getMarkerFromSearchParams = () => {
  const searchParams = new URLSearchParams(window.location.search);

  const searchX = Number(searchParams.get('x'));
  const searchY = Number(searchParams.get('y'));

  const regularMarker = Object.entries(markersData)
    .flatMap(([category, { markers, filterLabel }]) =>
      markers.map((marker) => ({
        ...marker,
        category: category as MarkerCategories,
        categoryFilterLabel: filterLabel,
      }))
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
    };
  }

  return regularMarker;
};

export default getMarkerFromSearchParams;
