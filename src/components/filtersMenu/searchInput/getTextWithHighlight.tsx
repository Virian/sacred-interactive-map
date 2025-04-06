import { HIGHLIGHT_INDICATOR } from './constants';

const getTextWithHighlight = (text: string) => {
  const startsWithHighlight = text.startsWith(HIGHLIGHT_INDICATOR);

  return text
    .split(HIGHLIGHT_INDICATOR)
    .filter((value) => value)
    .map((phrasePart, index) => {
      if (startsWithHighlight) {
        if (index % 2 === 0) {
          return <mark>{phrasePart}</mark>;
        }

        return phrasePart;
      }

      if (index % 2 === 0) {
        return phrasePart;
      }

      return <mark>{phrasePart}</mark>;
    });
};

export default getTextWithHighlight;
