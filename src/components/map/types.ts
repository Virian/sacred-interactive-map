import { Coords } from '../../types';

export type LoadedImage = {
  img: HTMLImageElement;
  coords: Coords;
};

export type LoadedImages = {
  [levelNumber: string]: Record<string, LoadedImage[]>;
};

export type MarkerCategories = 'dragons' | 'portals' | 'chests' | 'bountyHunt';

export type Marker = Coords & {
  id: string;
  screenX: number;
  screenY: number;
  label: string;
  description: string | null;
  category: string;
};

export type LoadedMarkers = {
  [key in MarkerCategories]: HTMLImageElement | null;
};
