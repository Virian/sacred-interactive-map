import availableTiles from '../../assets/availableTiles.json';

import { Coords } from './types';

const isTileAvailable = ({ x, y }: Coords) : boolean => availableTiles.some(tile => tile.x === x && tile.y === y);

export default isTileAvailable;
