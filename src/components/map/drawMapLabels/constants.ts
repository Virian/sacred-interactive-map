import regionsData from '../../../assets/regions.json';

// Labels don't have any predefined size. This is the maximum distance between
// a map edge and label origin where label is drawn on canvas. If the
// distance is larger and the label origin is not visible on screen, it won't
// be drawn at all.
export const TOWN_LABEL_HORIZONTAL_VISIBILITY_MARGIN = 180;
export const TOWN_LABEL_VERTICAL_VISIBILITY_MARGIN = 100;
// one value for both dimensions as it has a higher possiblity of being rotated
export const REGION_LABEL_VISIBILITY_MARGIN = 200;

export const regionLabels = regionsData.flatMap(({ labels }) => labels);

export const mapZoomLevelToFontSize: Record<number, number> = {
  1: 17,
  4: 20,
  6: 22,
  8: 24,
  9: 26,
  10: 28,
  11: 32,
  12: 40,
};
