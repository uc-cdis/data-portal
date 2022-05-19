import { pluckFromFilter, pluckFromAnchorFilter } from './utils';

describe('pluckFromFilter', () => {
  test('no filter', () => {
    const received = pluckFromFilter({ filter: {}, field: 'foo' });
    const expected = {};
    expect(received).toStrictEqual(expected);
  });
  test('matching', () => {
    const received1 = pluckFromFilter({
      field: 'foo',
      filter: { foo: {} },
    });
    const expected1 = {};
    expect(received1).toStrictEqual(expected1);

    const received2 = pluckFromFilter({
      field: 'bar',
      filter: { foo: {}, bar: {} },
    });
    const expected2 = { foo: {} };
    expect(received2).toStrictEqual(expected2);
  });
  test('missing', () => {
    const received1 = pluckFromFilter({
      field: 'bar',
      filter: { foo: {} },
    });
    const expected1 = { foo: {} };
    expect(received1).toStrictEqual(expected1);

    const received2 = pluckFromFilter({
      field: 'baz',
      filter: { foo: {}, bar: {} },
    });
    const expected2 = { foo: {}, bar: {} };
    expect(received2).toStrictEqual(expected2);
  });
});

describe('pluckFromAnchorFilter', () => {
  test('no filter', () => {
    const received = pluckFromAnchorFilter({
      anchor: 'x:y',
      field: 'foo',
      filter: {},
    });
    const expected = {};
    expect(received).toStrictEqual(expected);
  });
  test('no anchor filter', () => {
    const received = pluckFromAnchorFilter({
      anchor: 'x:y',
      field: 'foo',
      filter: { foo: {} },
    });
    const expected = { foo: {} };
    expect(received).toStrictEqual(expected);
  });
  test('matching', () => {
    const received1 = pluckFromAnchorFilter({
      anchor: 'x:y',
      field: 'foo',
      filter: { 'x:y': { filter: { foo: {} } } },
    });
    const expected1 = {};
    expect(received1).toStrictEqual(expected1);

    const received2 = pluckFromAnchorFilter({
      anchor: 'x:y',
      field: 'foo',
      filter: { 'x:y': { filter: { foo: {}, bar: {} } } },
    });
    const expected2 = { 'x:y': { filter: { bar: {} } } };
    expect(received2).toStrictEqual(expected2);

    const received3 = pluckFromAnchorFilter({
      anchor: 'x:y',
      field: 'foo',
      filter: { foo: {}, 'x:y': { filter: { foo: {} } } },
    });
    const expected3 = { foo: {} };
    expect(received3).toStrictEqual(expected3);
  });
  test('missing', () => {
    const received1 = pluckFromAnchorFilter({
      anchor: 'x:y',
      field: 'foo',
      filter: { 'x:y': { filter: { bar: {} } } },
    });
    const expected1 = { 'x:y': { filter: { bar: {} } } };
    expect(received1).toStrictEqual(expected1);

    const received2 = pluckFromAnchorFilter({
      anchor: 'x:y',
      field: 'foo',
      filter: { foo: {}, 'x:y': { filter: { bar: {} } } },
    });
    const expected2 = { foo: {}, 'x:y': { filter: { bar: {} } } };
    expect(received2).toStrictEqual(expected2);
  });
});
