export const TILE_SIZE = 256;

export const HORIZONTAL_TILES = 199;
export const VERTICAL_TILES = 99;
export const MAP_WIDTH = HORIZONTAL_TILES * TILE_SIZE;
export const MAP_HEIGHT = VERTICAL_TILES * TILE_SIZE;

// some levels were omitted on purpose because they are unnecessary for a smooth UX
// they are also omitted in gitignore
export const MAP_SCALE_LEVELS = [
  { levelNumber: 12, scale: 1 },
  { levelNumber: 11, scale: 3 },
  { levelNumber: 10, scale: 5 },
  { levelNumber: 9, scale: 7 },
  { levelNumber: 8, scale: 9 },
  { levelNumber: 6, scale: 13 },
  { levelNumber: 4, scale: 17 },
  { levelNumber: 1, scale: 23 },
];
export const INITIAL_SCALE_LEVEL =
  MAP_SCALE_LEVELS[MAP_SCALE_LEVELS.length - 1];
export const INITIAL_SCALE_LEVEL_WITH_MARKER_SELECTED = MAP_SCALE_LEVELS[0];

export const FILTER_CATEGORY_CAVES = 'caves';
