import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Marker } from '../../types';
import getMarkerFromSearchParams from '../getMarkerFromSearchParams';

vi.mock('../../assets/markers.json', () => ({
  default: {
    dragons: {
      filterLabel: 'dragon-filter',
      size: 32,
      markers: [
        {
          id: 'dragon-1',
          x: 10,
          y: 20,
          z: 0,
          label: 'dragon-label-1',
          description: null,
        },
        {
          id: 'dragon-2',
          x: 10,
          y: 30,
          z: 0,
          label: 'dragon-label-2',
          description: null,
        },
      ],
    },
    portals: {
      filterLabel: 'portal-filter',
      size: 32,
      markers: [
        {
          id: 'portal-1',
          x: 10,
          y: 40,
          z: 0,
          label: 'portal-label-1',
          description: null,
        },
        {
          id: 'portal-2',
          x: 20,
          y: 20,
          z: 1,
          label: 'portal-label-2',
          description: 'portal-description-2',
        },
      ],
    },
  },
}));

const cases: [string, Marker | undefined][] = [
  ['', undefined],
  ['?x=0&y=0', undefined],
  ['?x=1&y=0', undefined],
  [
    '?x=10&y=20',
    {
      id: 'dragon-1',
      x: 10,
      y: 20,
      z: 0,
      category: 'dragons',
      categoryFilterLabel: 'dragon-filter',
      label: 'dragon-label-1',
      description: null,
      size: 32,
    },
  ],
  [
    '?x=10&y=30',
    {
      id: 'dragon-2',
      x: 10,
      y: 30,
      z: 0,
      category: 'dragons',
      categoryFilterLabel: 'dragon-filter',
      label: 'dragon-label-2',
      description: null,
      size: 32,
    },
  ],
  [
    '?x=20&y=20',
    {
      id: 'portal-2',
      x: 20,
      y: 20,
      z: 1,
      category: 'portals',
      categoryFilterLabel: 'portal-filter',
      label: 'portal-label-2',
      description: 'portal-description-2',
      size: 32,
    },
  ],
  [
    '?x=20&y=30',
    {
      id: 'custom',
      x: 20,
      y: 30,
      z: 0,
      category: 'custom',
      categoryFilterLabel: 'Custom location',
      label: 'Your location',
      description: null,
      size: 64,
    },
  ],
  [
    '?x=10&y=10',
    {
      id: 'custom',
      x: 10,
      y: 10,
      z: 0,
      category: 'custom',
      categoryFilterLabel: 'Custom location',
      label: 'Your location',
      description: null,
      size: 64,
    },
  ],
];

const originalWindowLocation = window.location;

describe('getMarkerFromSearchParams', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it.each(cases)(
    'should return correct marker for search params %s',
    (searchParams, expectedResult) => {
      // given
      vi.spyOn(window, 'location', 'get').mockReturnValue({
        ...originalWindowLocation,
        search: searchParams,
      });

      // when
      const result = getMarkerFromSearchParams();

      // then
      expect(result).toStrictEqual(expectedResult);
    },
  );
});
