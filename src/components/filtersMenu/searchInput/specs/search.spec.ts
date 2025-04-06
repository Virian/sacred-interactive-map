import { describe, expect, it, vi } from 'vitest';

import { Marker } from '../../../../types';
import search from '../search';

vi.mock('../../../../assets/markers.json', () => ({
  default: {
    chests: {
      filterLabel: 'chests',
      size: 10,
      markers: [
        {
          id: 'marker1',
          x: 11,
          y: 12,
          z: 13,
          label: 'label1',
          description: 'desc1',
        },
        {
          id: 'marker2',
          x: 21,
          y: 22,
          z: 23,
          label: 'label2',
          description: 'desc2',
        },
        {
          id: 'marker3',
          x: 31,
          y: 32,
          z: 33,
          label: 'label3',
          description: 'test',
        },
      ],
    },
    dragons: {
      filterLabel: 'dragons',
      size: 20,
      markers: [
        {
          id: 'marker4',
          x: 41,
          y: 42,
          z: 43,
          label: 'label4',
          description: 'desc4',
        },
        {
          id: 'marker5',
          x: 51,
          y: 52,
          z: 53,
          label: 'test',
          description: 'desc5',
        },
      ],
    },
  },
}));

const cases: [string, Array<Marker>][] = [
  ['', []],
  [
    'labe',
    [
      {
        id: 'marker1',
        category: 'chests',
        categoryFilterLabel: 'chests',
        size: 10,
        x: 11,
        y: 12,
        z: 13,
        label: '**labe**l1',
        description: 'desc1',
      },
      {
        id: 'marker2',
        category: 'chests',
        categoryFilterLabel: 'chests',
        size: 10,
        x: 21,
        y: 22,
        z: 23,
        label: '**labe**l2',
        description: 'desc2',
      },
      {
        id: 'marker3',
        category: 'chests',
        categoryFilterLabel: 'chests',
        size: 10,
        x: 31,
        y: 32,
        z: 33,
        label: '**labe**l3',
        description: 'test',
      },
      {
        id: 'marker4',
        category: 'dragons',
        categoryFilterLabel: 'dragons',
        size: 20,
        x: 41,
        y: 42,
        z: 43,
        label: '**labe**l4',
        description: 'desc4',
      },
    ],
  ],
  [
    'sc5',
    [
      {
        id: 'marker5',
        category: 'dragons',
        categoryFilterLabel: 'dragons',
        size: 20,
        x: 51,
        y: 52,
        z: 53,
        label: 'test',
        description: 'de**sc5**',
      },
    ],
  ],
  [
    'test',
    [
      {
        id: 'marker5',
        category: 'dragons',
        categoryFilterLabel: 'dragons',
        size: 20,
        x: 51,
        y: 52,
        z: 53,
        label: '**test**',
        description: 'desc5',
      },
      {
        id: 'marker3',
        category: 'chests',
        categoryFilterLabel: 'chests',
        size: 10,
        x: 31,
        y: 32,
        z: 33,
        label: 'label3',
        description: '**test**',
      },
    ],
  ],
];

describe('search', () => {
  it.each(cases)(
    'for search phrase %s should return %o',
    (phrase, expectedResult) => {
      // when
      const result = search(phrase);

      // then
      expect(result).toEqual(expectedResult);
    },
  );
});
