import availableTiles from '../../assets/availableTiles.json';

import { Coords } from './types';

interface IsTileAvailableParams extends Coords {
  scaleLevel: number;
}

const isTileAvailable = ({
  x,
  y,
  scaleLevel,
}: IsTileAvailableParams): boolean =>
  availableTiles[`${scaleLevel}` as keyof typeof availableTiles].some(
    (tile) => tile.x === x && tile.y === y
  );

export default isTileAvailable;
