export const TILE_SIZE = 256;

export const HORIZONTAL_TILES = 199;
export const VERTICAL_TILES = 99;
export const MAP_WIDTH = HORIZONTAL_TILES * TILE_SIZE;
export const MAP_HEIGHT = VERTICAL_TILES * TILE_SIZE;

// some levels were omitted on purpose because they are unnecessary for a smooth UX
// they are also omitted in gitignore
export const MAP_SCALE_LEVELS = [
  { level: 12, scale: 1 },
  { level: 11, scale: 3 },
  { level: 10, scale: 5 },
  { level: 9, scale: 7 },
  { level: 8, scale: 9 },
  { level: 6, scale: 13 },
  { level: 4, scale: 17 },
  { level: 1, scale: 23 },
];
export const INITIAL_SCALE_LEVEL = MAP_SCALE_LEVELS[MAP_SCALE_LEVELS.length - 1];

export const MOUSE_MOVE_THROTTLE_TIMEOUT = 16;
