import { describe, expect, it } from 'vitest';

import getTextWithHighlight from '../getTextWithHighlight';

const cases: [string, Array<string | React.JSX.Element>][] = [
  ['Lorem ipsum dolor sit amet', ['Lorem ipsum dolor sit amet']],
  [
    'Lorem ipsum **dolor** sit amet',
    ['Lorem ipsum ', <mark>dolor</mark>, ' sit amet'],
  ],
  [
    'Lorem ipsum dolor sit **amet**',
    ['Lorem ipsum dolor sit ', <mark>amet</mark>],
  ],
  [
    '**Lorem** ipsum dolor sit amet',
    [<mark>Lorem</mark>, ' ipsum dolor sit amet'],
  ],
  ['**Lorem ipsum dolor sit amet**', [<mark>Lorem ipsum dolor sit amet</mark>]],
  [
    'Lorem **ipsum** dolor **sit** amet',
    ['Lorem ', <mark>ipsum</mark>, ' dolor ', <mark>sit</mark>, ' amet'],
  ],
  [
    "L**or,em Ip.sum D?olor S'it Am!e**t",
    ['L', <mark>or,em Ip.sum D?olor S'it Am!e</mark>, 't'],
  ],
];

describe('getTextWithHighlight', () => {
  it.each(cases)(
    'should return string with added <mark> elements for %s',
    (text, expectedResult) => {
      // when
      const result = getTextWithHighlight(text);

      // then
      expect(result).toEqual(expectedResult);
    },
  );
});
