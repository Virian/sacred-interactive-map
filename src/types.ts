export type Coords = {
  x: number;
  y: number;
};

export type ZoomLevel = {
  scale: number;
  levelNumber: number;
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
  size: number;
};
