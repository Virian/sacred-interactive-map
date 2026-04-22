import { HIGHLIGHT_INDICATOR } from './constants';

const getTextWithHighlight = (text: string) =>
  text
    .split(HIGHLIGHT_INDICATOR)
    .map((phrasePart, index) => {
      if (phrasePart === '') return null;
      if (index % 2 === 0) {
        return phrasePart;
      } else {
        return <mark>{phrasePart}</mark>;
      }
    })
    .filter(Boolean);

export default getTextWithHighlight;
