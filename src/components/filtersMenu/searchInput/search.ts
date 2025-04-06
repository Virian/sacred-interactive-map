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

const highlightText = (text: string, index: number, length: number) => {
  if (index < 0) {
    return text;
  }

  return (
    text.slice(0, index) +
    HIGHLIGHT_INDICATOR +
    text.slice(index, index + length) +
    HIGHLIGHT_INDICATOR +
    text.slice(index + length)
  );
};

const search = (phrase: string) => {
  if (!phrase) {
    return [];
  }

  const lowerCasePhrase = phrase.toLocaleLowerCase();

  const markersWithHighlights = allMarkers.reduce<{
    markersWithPhraseInLabel: Array<Marker>;
    markersWithPhraseInDescription: Array<Marker>;
  }>(
    (acc, marker) => {
      const labelIndex = marker.label
        .toLocaleLowerCase()
        .indexOf(lowerCasePhrase);
      const descriptionIndex =
        marker.description?.toLocaleLowerCase().indexOf(lowerCasePhrase) ?? -1;

      if (labelIndex === -1 && descriptionIndex === -1) {
        return acc;
      }

      const markerWithHighlight = {
        ...marker,
        label: highlightText(marker.label, labelIndex, phrase.length),
        description: marker.description
          ? highlightText(marker.description, descriptionIndex, phrase.length)
          : marker.description,
      };

      if (labelIndex > -1) {
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
