import { FILTER_TYPE, pluckFromFilter, pluckFromAnchorFilter } from './utils';

describe('pluckFromFilter', () => {
  test('no filter', () => {
    const received = pluckFromFilter({ filter: {}, field: 'foo' });
    const expected = {};
    expect(received).toStrictEqual(expected);
  });
  test('matching', () => {
    const received1 = pluckFromFilter({
      field: 'foo',
      filter: { value: { foo: {} } },
    });
    const expected1 = {};
    expect(received1).toStrictEqual(expected1);

    const received2 = pluckFromFilter({
      field: 'bar',
      filter: { value: { foo: {}, bar: {} } },
    });
    const expected2 = { value: { foo: {} } };
    expect(received2).toStrictEqual(expected2);
  });
  test('missing', () => {
    const received1 = pluckFromFilter({
      field: 'bar',
      filter: { value: { foo: {} } },
    });
    const expected1 = { value: { foo: {} } };
    expect(received1).toStrictEqual(expected1);

    const received2 = pluckFromFilter({
      field: 'baz',
      filter: { value: { foo: {}, bar: {} } },
    });
    const expected2 = { value: { foo: {}, bar: {} } };
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
      filter: { value: { foo: {} } },
    });
    const expected = { value: { foo: {} } };
    expect(received).toStrictEqual(expected);
  });
  test('matching', () => {
    const received1 = pluckFromAnchorFilter({
      anchor: 'x:y',
      field: 'foo',
      filter: {
        value: {
          'x:y': {
            __type: FILTER_TYPE.ANCHORED,
            value: { foo: {} },
          },
        },
      },
    });
    const expected1 = {};
    expect(received1).toStrictEqual(expected1);

    const received2 = pluckFromAnchorFilter({
      anchor: 'x:y',
      field: 'foo',
      filter: {
        value: {
          'x:y': {
            __type: FILTER_TYPE.ANCHORED,
            value: { foo: {}, bar: {} },
          },
        },
      },
    });
    const expected2 = {
      value: {
        'x:y': { __type: FILTER_TYPE.ANCHORED, value: { bar: {} } },
      },
    };
    expect(received2).toStrictEqual(expected2);

    const received3 = pluckFromAnchorFilter({
      anchor: 'x:y',
      field: 'foo',
      filter: {
        value: {
          foo: {},
          'x:y': {
            __type: FILTER_TYPE.ANCHORED,
            value: { foo: {} },
          },
        },
      },
    });
    const expected3 = { value: { foo: {} } };
    expect(received3).toStrictEqual(expected3);
  });
  test('missing', () => {
    const received1 = pluckFromAnchorFilter({
      anchor: 'x:y',
      field: 'foo',
      filter: {
        value: {
          'x:y': {
            __type: FILTER_TYPE.ANCHORED,
            value: { bar: {} },
          },
        },
      },
    });
    const expected1 = {
      value: {
        'x:y': { __type: FILTER_TYPE.ANCHORED, value: { bar: {} } },
      },
    };
    expect(received1).toStrictEqual(expected1);

    const received2 = pluckFromAnchorFilter({
      anchor: 'x:y',
      field: 'foo',
      filter: {
        value: {
          foo: {},
          'x:y': {
            __type: FILTER_TYPE.ANCHORED,
            value: { bar: {} },
          },
        },
      },
    });
    const expected2 = {
      value: {
        foo: {},
        'x:y': { __type: FILTER_TYPE.ANCHORED, value: { bar: {} } },
      },
    };
    expect(received2).toStrictEqual(expected2);
  });
});
