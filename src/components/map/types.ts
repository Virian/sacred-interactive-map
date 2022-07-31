export type Coords = {
  x: number;
  y: number;
};

export type LoadedImage = {
  img: HTMLImageElement;
  coords: Coords;
};

export type LoadedImages = {
  [level: string]: Record<string, LoadedImage[]>;
};

export type MarkerCategories = 'dragons' | 'portals' | 'chests';

export type LoadedMarkers = {
  [key in MarkerCategories]: HTMLImageElement | null;
};
