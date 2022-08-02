import markersData from './assets/markers.json';

const getMarkerFromSearchParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return Object.entries(markersData)
    .flatMap(([category, { markers, filterLabel }]) =>
      markers.map((marker) => ({
        ...marker,
        category,
        categoryFilterLabel: filterLabel,
      }))
    )
    .find(
      ({ x, y }) =>
        x === Number(searchParams.get('x')) &&
        y === Number(searchParams.get('y'))
    );
};

export default getMarkerFromSearchParams;
