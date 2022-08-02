import getMarkerFromSearchParams from '../getMarkerFromSearchParams';
import { Marker } from '../components/map/types';

jest.mock('../assets/markers.json', () => ({
  dragons: {
    filterLabel: 'dragon-filter',
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
    },
  ],
];

const originalWindowLocation = window.location;

describe('getMarkerFromSearchParams', () => {
  beforeAll(() => {
    Reflect.deleteProperty(window, 'location');
    window.location = {
      ...originalWindowLocation,
      search: '',
    };
  });

  it.each(cases)(
    'should return correct marker for search params %s',
    (searchParams, expectedResult) => {
      // given
      window.location.search = searchParams;

      // when
      const result = getMarkerFromSearchParams();

      // then
      expect(result).toStrictEqual(expectedResult);
    }
  );
});
