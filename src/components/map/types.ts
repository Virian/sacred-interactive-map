export type Coords = {
  x: number;
  y: number;
};

export type LoadedImage = {
  img: HTMLImageElement;
  coords: Coords;
};

export type LoadedImages = {
  [levelNumber: string]: Record<string, LoadedImage[]>;
};

export type Marker = Coords & {
  label: string;
};

export type MarkerCategories = 'dragons' | 'portals' | 'chests' | 'bountyHunt';

export type LoadedMarkers = {
  [key in MarkerCategories]: HTMLImageElement | null;
};
