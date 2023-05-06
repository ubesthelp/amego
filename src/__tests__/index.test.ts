import add from '../index';

describe('add', () => {
  test('1 + 2 = 3', () => {
    expect(add(1, 2)).toEqual(3);
  });
});
