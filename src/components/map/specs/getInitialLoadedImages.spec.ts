import getInitialLoadedImages from '../getInitialLoadedImages';

jest.mock('../constants', () => ({
  HORIZONTAL_TILES: 5,
  MAP_SCALE_LEVELS: [{ level: 2, scale: 1 }, { level: 1, scale: 2 }],
}));

const expected = {
  '2': {
    '0': [],
    '1': [],
    '2': [],
    '3': [],
    '4': [],
  },
  '1': {
    '0': [],
    '1': [],
    '2': [],
  },
}

describe('getInitialLoadedImages', () => {
  it('should return correct initial loaded images shape', () => {
    // when
    const result = getInitialLoadedImages();

    // then
    expect(result).toStrictEqual(expected);
  });
});
