export type Coords = {
  x: number;
  y: number;
}

export type LoadedImage = {
  img: HTMLImageElement;
  coords: Coords;
}

export type LoadedImages = {
  [level: string]: Record<string, LoadedImage[]>;
}
