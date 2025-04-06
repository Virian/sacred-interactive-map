import { Coords, Marker, MarkerCategories } from '../../types';

export type LoadedImage = {
  img: HTMLImageElement;
  coords: Coords;
};

export type LoadedImages = {
  [levelNumber: string]: Record<string, LoadedImage[]>;
};

export type CustomMarker = Omit<Marker, 'category'> & {
  category: 'custom';
};

export type LoadedMarkers = {
  [key in MarkerCategories]: HTMLImageElement | null;
};
