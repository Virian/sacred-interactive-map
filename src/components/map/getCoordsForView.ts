import range from 'lodash/range';

import { TILE_SIZE } from './constants';

const getCoordsForView = (
  numberOfHorizontalTiles: number,
  numberOfVerticalTiles: number,
  currentXOffset: number,
  currentYOffset: number,
): { xCoords: number[], yCoords: number[] } => {
  const xCoords = range(numberOfHorizontalTiles).map(i => {
    const xOffset = currentXOffset + i * TILE_SIZE;
    return Math.floor(xOffset / TILE_SIZE) - 1; // subtracting 1 to fetch tiles outside of the view
  });
  const yCoords = range(numberOfVerticalTiles).map(i => {
    const yOffset = currentYOffset + i * TILE_SIZE;
    return Math.floor(yOffset / TILE_SIZE) - 1;
  });
  return { xCoords, yCoords };
}

export default getCoordsForView;
