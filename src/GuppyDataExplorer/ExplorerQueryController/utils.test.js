import { pluckFromFilter, pluckFromAnchorFilter } from './utils';

describe('pluckFromFilter', () => {
  test('no filter', () => {
    const received = pluckFromFilter({ filter: {}, filterKey: 'foo' });
    const expected = {};
    expect(received).toStrictEqual(expected);
  });
  test('matching', () => {
    const received1 = pluckFromFilter({
      filter: { foo: '' },
      filterKey: 'foo',
    });
    const expected1 = {};
    expect(received1).toStrictEqual(expected1);

    const received2 = pluckFromFilter({
      filter: { foo: '', bar: '' },
      filterKey: 'bar',
    });
    const expected2 = { foo: '' };
    expect(received2).toStrictEqual(expected2);
  });
  test('missing', () => {
    const received1 = pluckFromFilter({
      filter: { foo: '' },
      filterKey: 'bar',
    });
    const expected1 = { foo: '' };
    expect(received1).toStrictEqual(expected1);

    const received2 = pluckFromFilter({
      filter: { foo: '', bar: '' },
      filterKey: 'baz',
    });
    const expected2 = { foo: '', bar: '' };
    expect(received2).toStrictEqual(expected2);
  });
});

describe('pluckFromAnchorFilter', () => {
  test('no filter', () => {
    const received = pluckFromAnchorFilter({
      filter: {},
      filterKey: 'foo',
      anchor: 'x:y',
    });
    const expected = {};
    expect(received).toStrictEqual(expected);
  });
  test('no anchor filter', () => {
    const received = pluckFromAnchorFilter({
      filter: { foo: '' },
      filterKey: 'foo',
      anchor: 'x:y',
    });
    const expected = { foo: '' };
    expect(received).toStrictEqual(expected);
  });
  test('matching', () => {
    const received1 = pluckFromAnchorFilter({
      filter: { 'x:y': { filter: { foo: '' } } },
      filterKey: 'foo',
      anchor: 'x:y',
    });
    const expected1 = {};
    expect(received1).toStrictEqual(expected1);

    const received2 = pluckFromAnchorFilter({
      filter: { 'x:y': { filter: { foo: '', bar: '' } } },
      filterKey: 'foo',
      anchor: 'x:y',
    });
    const expected2 = { 'x:y': { filter: { bar: '' } } };
    expect(received2).toStrictEqual(expected2);

    const received3 = pluckFromAnchorFilter({
      filter: { foo: '', 'x:y': { filter: { foo: '' } } },
      filterKey: 'foo',
      anchor: 'x:y',
    });
    const expected3 = { foo: '' };
    expect(received3).toStrictEqual(expected3);
  });
  test('missing', () => {
    const received1 = pluckFromAnchorFilter({
      filter: { 'x:y': { filter: { bar: '' } } },
      filterKey: 'foo',
      anchor: 'x:y',
    });
    const expected1 = { 'x:y': { filter: { bar: '' } } };
    expect(received1).toStrictEqual(expected1);

    const received2 = pluckFromAnchorFilter({
      filter: { foo: '', 'x:y': { filter: { bar: '' } } },
      filterKey: 'foo',
      anchor: 'x:y',
    });
    const expected2 = { foo: '', 'x:y': { filter: { bar: '' } } };
    expect(received2).toStrictEqual(expected2);
  });
});
