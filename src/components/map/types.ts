import { Coords } from '../../types';

export type LoadedImage = {
  img: HTMLImageElement;
  coords: Coords;
};

export type LoadedImages = {
  [levelNumber: string]: Record<string, LoadedImage[]>;
};

export type MarkerCategories =
  | 'custom'
  | 'dragons'
  | 'portals'
  | 'chests'
  | 'bountyHunt'
  | 'caves';

export type Marker = Coords & {
  z: number;
  id: string;
  screenX?: number;
  screenY?: number;
  label: string;
  description: string | null;
  category: MarkerCategories;
  categoryFilterLabel: string;
  linkedMarkerId?: string;
};

export type CustomMarker = Omit<Marker, 'category'> & {
  category: 'custom';
};

export type LoadedMarkers = {
  [key in MarkerCategories]: HTMLImageElement | null;
};
