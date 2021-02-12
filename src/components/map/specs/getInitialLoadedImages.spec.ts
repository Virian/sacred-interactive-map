import getInitialLoadedImages from '../getInitialLoadedImages';

jest.mock('../constants', () => ({ HORIZONTAL_TILES: 5 }));

const expected = {
  '0': [],
  '1': [],
  '2': [],
  '3': [],
  '4': [],
}

describe('getInitialLoadedImages', () => {
  it('should return correct initial loaded images shape', () => {
    // when
    const result = getInitialLoadedImages();

    // then
    expect(result).toStrictEqual(expected);
  });
});
