import range from 'lodash/range';

import { TILE_SIZE } from '../../constants';

const getTileCoordsForView = (
  numberOfHorizontalTiles: number,
  numberOfVerticalTiles: number,
  currentXOffset: number,
  currentYOffset: number,
  scale: number,
): { tileXCoords: number[]; tileYCoords: number[] } => {
  const firstXCoord = Math.floor(currentXOffset / (TILE_SIZE * scale)) - 1; // subtracting 1 to fetch tiles outside of the view
  const tileXCoords = range(firstXCoord, firstXCoord + numberOfHorizontalTiles);

  const firstYCoord = Math.floor(currentYOffset / (TILE_SIZE * scale)) - 1;
  const tileYCoords = range(firstYCoord, firstYCoord + numberOfVerticalTiles);

  return { tileXCoords, tileYCoords };
};

export default getTileCoordsForView;
