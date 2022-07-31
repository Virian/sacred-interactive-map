import availableTiles from '../../assets/availableTiles.json';
import { Coords } from '../../types';

interface IsTileAvailableParams extends Coords {
  zoomLevelNumber: number;
}

const isTileAvailable = ({
  x,
  y,
  zoomLevelNumber,
}: IsTileAvailableParams): boolean =>
  availableTiles[`${zoomLevelNumber}` as keyof typeof availableTiles].some(
    (tile) => tile.x === x && tile.y === y
  );

export default isTileAvailable;
