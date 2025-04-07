import markersData from '../../../assets/markers.json';
import type { Marker, MarkerCategories } from '../../../types';
import { HIGHLIGHT_INDICATOR } from './constants';

const allMarkers = Object.entries(markersData).flatMap(
  ([category, { markers, size, filterLabel }]) =>
    markers.map((marker) => ({
      ...marker,
      category: category as MarkerCategories,
      categoryFilterLabel: filterLabel,
      size,
    })),
);

const search = (phrase: string) => {
  if (!phrase) {
    return [];
  }

  const phraseRegex = new RegExp(
    phrase
      .split('')
      .join(
        '[\\!\\@\\#\\$\\%\\^\\&\\*\\)\\(\\+\\=\\.\\<\\>\\{\\}\\[\\]\\:\\;\\\'"\\|\\~\\`\\_\\-]*',
      ),
    'gi',
  );

  const markersWithHighlights = allMarkers.reduce<{
    markersWithPhraseInLabel: Array<Marker>;
    markersWithPhraseInDescription: Array<Marker>;
  }>(
    (acc, marker) => {
      const isPhraseInLabel = Boolean(marker.label.match(phraseRegex));
      const isPhraseInDescription = Boolean(
        marker.description?.match(phraseRegex),
      );

      if (!isPhraseInLabel && !isPhraseInDescription) {
        return acc;
      }

      const markerWithHighlight = {
        ...marker,
        label: marker.label.replace(
          phraseRegex,
          `${HIGHLIGHT_INDICATOR}$&${HIGHLIGHT_INDICATOR}`,
        ),
        description: marker.description
          ? marker.description.replace(
              phraseRegex,
              `${HIGHLIGHT_INDICATOR}$&${HIGHLIGHT_INDICATOR}`,
            )
          : marker.description,
      };

      if (isPhraseInLabel) {
        return {
          ...acc,
          markersWithPhraseInLabel: [
            ...acc.markersWithPhraseInLabel,
            markerWithHighlight,
          ],
        };
      }

      return {
        ...acc,
        markersWithPhraseInDescription: [
          ...acc.markersWithPhraseInDescription,
          markerWithHighlight,
        ],
      };
    },
    { markersWithPhraseInLabel: [], markersWithPhraseInDescription: [] },
  );

  return [
    ...markersWithHighlights.markersWithPhraseInLabel,
    ...markersWithHighlights.markersWithPhraseInDescription,
  ];
};

export default search;
