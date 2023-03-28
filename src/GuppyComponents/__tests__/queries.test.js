import { FILTER_TYPE } from '../Utils/const';
import {
  getGQLFilter,
  getQueryInfoForAggregationOptionsData,
} from '../Utils/queries';

/** @typedef {import('../types').CombineMode} CombineMode */

describe('Get GQL filter from filter object from', () => {
  test('an undefined filter', () => {
    const filterState = undefined;
    const gqlFilter = undefined;
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });

  test('an empty filter', () => {
    const filterState = {};
    const gqlFilter = undefined;
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });

  test('an empty value filter', () => {
    const filterState = { __combindMode: 'AND', value: {} };
    const gqlFilter = undefined;
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });

  test('a simple option filter', () => {
    const filterState = {
      value: {
        a: { __type: FILTER_TYPE.OPTION, selectedValues: ['foo', 'bar'] },
      },
    };
    const gqlFilter = { AND: [{ IN: { a: ['foo', 'bar'] } }] };
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });

  test('a simple exclusion option filter', () => {
    const filterState = {
      value: {
        a: {
          __type: FILTER_TYPE.OPTION,
          selectedValues: ['foo', 'bar'],
          isExclusion: true,
        },
      },
    };
    const gqlFilter = {
      AND: [
        {
          AND: [
            {
              '!=': {
                a: 'foo',
              },
            },
            {
              '!=': {
                a: 'bar',
              },
            },
          ],
        },
      ],
    };
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });

  test('a simple option filter with combine mode OR', () => {
    const filterState = {
      value: {
        a: {
          __combineMode: /** @type {CombineMode} */ ('OR'),
          __type: FILTER_TYPE.OPTION,
          selectedValues: ['foo', 'bar'],
        },
      },
    };
    const gqlFilter = { AND: [{ IN: { a: ['foo', 'bar'] } }] };
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });

  test('a simple option filter with combine mode AND', () => {
    const filterState = {
      value: {
        a: {
          __combineMode: /** @type {CombineMode} */ ('AND'),
          __type: FILTER_TYPE.OPTION,
          selectedValues: ['foo', 'bar'],
        },
      },
    };
    const gqlFilter = {
      AND: [{ AND: [{ IN: { a: ['foo'] } }, { IN: { a: ['bar'] } }] }],
    };
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });

  test('a simple range filter', () => {
    const filterState = {
      value: {
        a: { __type: FILTER_TYPE.RANGE, lowerBound: 0, upperBound: 1 },
      },
    };
    const gqlFilter = {
      AND: [{ AND: [{ GTE: { a: 0 } }, { LTE: { a: 1 } }] }],
    };
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });

  test('simple filters', () => {
    const filterState = {
      __combineMode: /** @type {CombineMode} */ ('OR'),
      value: {
        a: { __type: FILTER_TYPE.OPTION, selectedValues: ['foo', 'bar'] },
        b: {
          __combineMode: /** @type {CombineMode} */ ('AND'),
          __type: FILTER_TYPE.OPTION,
          selectedValues: ['foo', 'bar'],
        },
        c: { __type: FILTER_TYPE.RANGE, lowerBound: 0, upperBound: 1 },
      },
    };
    const gqlFilter = {
      OR: [
        { IN: { a: ['foo', 'bar'] } },
        { AND: [{ IN: { b: ['foo'] } }, { IN: { b: ['bar'] } }] },
        { AND: [{ GTE: { c: 0 } }, { LTE: { c: 1 } }] },
      ],
    };
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });

  test('simple filters with exclusion', () => {
    const filterState = {
      __combineMode: /** @type {CombineMode} */ ('OR'),
      value: {
        a: {
          __type: FILTER_TYPE.OPTION,
          selectedValues: ['foo', 'bar'],
          isExclusion: true,
        },
        b: {
          __combineMode: /** @type {CombineMode} */ ('AND'),
          __type: FILTER_TYPE.OPTION,
          selectedValues: ['foo', 'bar'],
        },
        c: { __type: FILTER_TYPE.RANGE, lowerBound: 0, upperBound: 1 },
      },
    };
    const gqlFilter = {
      OR: [
        {
          AND: [
            {
              '!=': {
                a: 'foo',
              },
            },
            {
              '!=': {
                a: 'bar',
              },
            },
          ],
        },
        { AND: [{ IN: { b: ['foo'] } }, { IN: { b: ['bar'] } }] },
        { AND: [{ GTE: { c: 0 } }, { LTE: { c: 1 } }] },
      ],
    };
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });
  test('a combine mode only filter', () => {
    const filterState = {
      value: {
        a: {
          __combineMode: /** @type {CombineMode} */ ('OR'),
          __type: FILTER_TYPE.OPTION,
        },
      },
    };
    const gqlFilter = { AND: [] };
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });

  test('an invalid filter', () => {
    const fieldName = 'a';
    const filterValue = {};
    const filterState = { value: { [fieldName]: filterValue } };
    // @ts-ignore: error expected for invalid filter
    expect(() => getGQLFilter(filterState)).toThrow(
      `Invalid filter object for "${fieldName}": ${JSON.stringify(filterValue)}`
    );
  });

  test('a nested filter', () => {
    const filterState = {
      __combineMode: /** @type {CombineMode} */ ('OR'),
      value: {
        'a.b': { __type: FILTER_TYPE.OPTION, selectedValues: ['foo', 'bar'] },
      },
    };
    const gqlFilter = {
      OR: [{ nested: { path: 'a', OR: [{ IN: { b: ['foo', 'bar'] } }] } }],
    };
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });

  test('a nested exclusion filter', () => {
    const filterState = {
      __combineMode: /** @type {CombineMode} */ ('OR'),
      value: {
        'a.b': {
          __type: FILTER_TYPE.OPTION,
          selectedValues: ['foo', 'bar'],
          isExclusion: true,
        },
      },
    };
    const gqlFilter = {
      OR: [
        {
          nested: {
            path: 'a',
            OR: [
              {
                AND: [
                  {
                    '!=': {
                      b: 'foo',
                    },
                  },
                  {
                    '!=': {
                      b: 'bar',
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    };
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });

  test('nested filters with same parent path', () => {
    const filterState = {
      value: {
        'a.b': { __type: FILTER_TYPE.OPTION, selectedValues: ['foo', 'bar'] },
        'a.c': { __type: FILTER_TYPE.RANGE, lowerBound: 0, upperBound: 1 },
      },
    };
    const gqlFilter = {
      AND: [
        {
          nested: {
            path: 'a',
            AND: [
              { IN: { b: ['foo', 'bar'] } },
              { AND: [{ GTE: { c: 0 } }, { LTE: { c: 1 } }] },
            ],
          },
        },
      ],
    };
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });

  test('nested exclusion filters with same parent path', () => {
    const filterState = {
      value: {
        'a.b': {
          __type: FILTER_TYPE.OPTION,
          selectedValues: ['foo', 'bar'],
          isExclusion: true,
        },
        'a.c': { __type: FILTER_TYPE.RANGE, lowerBound: 0, upperBound: 1 },
      },
    };
    const gqlFilter = {
      AND: [
        {
          nested: {
            path: 'a',
            AND: [
              {
                AND: [
                  {
                    '!=': {
                      b: 'foo',
                    },
                  },
                  {
                    '!=': {
                      b: 'bar',
                    },
                  },
                ],
              },
              { AND: [{ GTE: { c: 0 } }, { LTE: { c: 1 } }] },
            ],
          },
        },
      ],
    };
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });

  test('nested filters with different parent paths', () => {
    const filterState = {
      value: {
        'a.b': { __type: FILTER_TYPE.OPTION, selectedValues: ['foo', 'bar'] },
        'c.d': { __type: FILTER_TYPE.RANGE, lowerBound: 0, upperBound: 1 },
      },
    };
    const gqlFilter = {
      AND: [
        {
          nested: {
            path: 'a',
            AND: [{ IN: { b: ['foo', 'bar'] } }],
          },
        },
        {
          nested: {
            path: 'c',
            AND: [{ AND: [{ GTE: { d: 0 } }, { LTE: { d: 1 } }] }],
          },
        },
      ],
    };
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });

  test('nested exclusion filters with different parent paths', () => {
    const filterState = {
      value: {
        'a.b': {
          __type: FILTER_TYPE.OPTION,
          selectedValues: ['foo', 'bar'],
          isExclusion: true,
        },
        'c.d': { __type: FILTER_TYPE.RANGE, lowerBound: 0, upperBound: 1 },
      },
    };
    const gqlFilter = {
      AND: [
        {
          nested: {
            path: 'a',
            AND: [
              {
                AND: [
                  {
                    '!=': {
                      b: 'foo',
                    },
                  },
                  {
                    '!=': {
                      b: 'bar',
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          nested: {
            path: 'c',
            AND: [{ AND: [{ GTE: { d: 0 } }, { LTE: { d: 1 } }] }],
          },
        },
      ],
    };
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });

  test('an anchored filter state', () => {
    const filterState = {
      __combineMode: /** @type {CombineMode} */ ('OR'),
      value: {
        'x:y': {
          __type: FILTER_TYPE.ANCHORED,
          value: {
            'a.b': {
              __type: FILTER_TYPE.OPTION,
              selectedValues: ['foo', 'bar'],
            },
            'c.d': {
              __type: FILTER_TYPE.RANGE,
              lowerBound: 0,
              upperBound: 1,
            },
          },
        },
      },
    };
    const gqlFilter = {
      OR: [
        {
          nested: {
            path: 'a',
            OR: [
              {
                AND: [
                  { IN: { x: ['y'] } },
                  { OR: [{ IN: { b: ['foo', 'bar'] } }] },
                ],
              },
            ],
          },
        },
        {
          nested: {
            path: 'c',
            OR: [
              {
                AND: [
                  { IN: { x: ['y'] } },
                  { OR: [{ AND: [{ GTE: { d: 0 } }, { LTE: { d: 1 } }] }] },
                ],
              },
            ],
          },
        },
      ],
    };
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });

  test('an anchored exclusion filter state', () => {
    const filterState = {
      __combineMode: /** @type {CombineMode} */ ('OR'),
      value: {
        'x:y': {
          __type: FILTER_TYPE.ANCHORED,
          value: {
            'a.b': {
              __type: FILTER_TYPE.OPTION,
              selectedValues: ['foo', 'bar'],
              isExclusion: true,
            },
            'c.d': {
              __type: FILTER_TYPE.RANGE,
              lowerBound: 0,
              upperBound: 1,
            },
          },
        },
      },
    };
    const gqlFilter = {
      OR: [
        {
          nested: {
            path: 'a',
            OR: [
              {
                AND: [
                  { IN: { x: ['y'] } },
                  {
                    OR: [
                      {
                        AND: [
                          {
                            '!=': {
                              b: 'foo',
                            },
                          },
                          {
                            '!=': {
                              b: 'bar',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          nested: {
            path: 'c',
            OR: [
              {
                AND: [
                  { IN: { x: ['y'] } },
                  { OR: [{ AND: [{ GTE: { d: 0 } }, { LTE: { d: 1 } }] }] },
                ],
              },
            ],
          },
        },
      ],
    };
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });
  test('various filters', () => {
    const filterState = {
      value: {
        a: { __type: FILTER_TYPE.OPTION, selectedValues: ['foo', 'bar'] },
        'b.c': {
          __combineMode: /** @type {CombineMode} */ ('AND'),
          __type: FILTER_TYPE.OPTION,
          selectedValues: ['foo', 'bar'],
        },
        'b.d': { __type: FILTER_TYPE.RANGE, lowerBound: 0, upperBound: 1 },
        e: {
          __combineMode: /** @type {CombineMode} */ ('OR'),
          __type: FILTER_TYPE.OPTION,
        },
        'f.g': { __type: FILTER_TYPE.RANGE, lowerBound: 0, upperBound: 1 },
      },
    };
    const gqlFilter = {
      AND: [
        { IN: { a: ['foo', 'bar'] } },
        {
          nested: {
            path: 'b',
            AND: [
              { AND: [{ IN: { c: ['foo'] } }, { IN: { c: ['bar'] } }] },
              { AND: [{ GTE: { d: 0 } }, { LTE: { d: 1 } }] },
            ],
          },
        },
        {
          nested: {
            path: 'f',
            AND: [{ AND: [{ GTE: { g: 0 } }, { LTE: { g: 1 } }] }],
          },
        },
      ],
    };
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });
  test('a simple composed filter', () => {
    const filterState = {
      __combineMode: /** @type {CombineMode} */ ('AND'),
      __type: FILTER_TYPE.COMPOSED,
      value: [
        {
          __combineMode: /** @type {CombineMode} */ ('AND'),
          __type: FILTER_TYPE.STANDARD,
          value: {
            a: { __type: FILTER_TYPE.OPTION, selectedValues: ['foo', 'bar'] },
          },
        },
        {
          __combineMode: /** @type {CombineMode} */ ('OR'),
          __type: FILTER_TYPE.STANDARD,
          value: {
            b: { __type: FILTER_TYPE.RANGE, lowerBound: 0, upperBound: 1 },
          },
        },
      ],
    };
    const gqlFilter = {
      AND: [
        {
          AND: [{ IN: { a: ['foo', 'bar'] } }],
        },
        {
          OR: [{ AND: [{ GTE: { b: 0 } }, { LTE: { b: 1 } }] }],
        },
      ],
    };
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });

  test('a simple exclusion composed filter', () => {
    const filterState = {
      __combineMode: /** @type {CombineMode} */ ('AND'),
      __type: FILTER_TYPE.COMPOSED,
      value: [
        {
          __combineMode: /** @type {CombineMode} */ ('AND'),
          __type: FILTER_TYPE.STANDARD,
          value: {
            a: {
              __type: FILTER_TYPE.OPTION,
              selectedValues: ['foo', 'bar'],
              isExclusion: true,
            },
          },
        },
        {
          __combineMode: /** @type {CombineMode} */ ('OR'),
          __type: FILTER_TYPE.STANDARD,
          value: {
            b: { __type: FILTER_TYPE.RANGE, lowerBound: 0, upperBound: 1 },
          },
        },
      ],
    };
    const gqlFilter = {
      AND: [
        {
          AND: [
            {
              AND: [
                {
                  '!=': {
                    a: 'foo',
                  },
                },
                {
                  '!=': {
                    a: 'bar',
                  },
                },
              ],
            },
          ],
        },
        {
          OR: [{ AND: [{ GTE: { b: 0 } }, { LTE: { b: 1 } }] }],
        },
      ],
    };
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });
  test('a higher-order composed filter', () => {
    const filterState = {
      __combineMode: /** @type {CombineMode} */ ('AND'),
      __type: FILTER_TYPE.COMPOSED,
      value: [
        {
          __combineMode: /** @type {CombineMode} */ ('OR'),
          __type: FILTER_TYPE.COMPOSED,
          value: [
            {
              __combineMode: /** @type {CombineMode} */ ('AND'),
              __type: FILTER_TYPE.STANDARD,
              value: {
                a: {
                  __type: FILTER_TYPE.OPTION,
                  selectedValues: ['foo', 'bar'],
                },
              },
            },
          ],
        },
        {
          __combineMode: /** @type {CombineMode} */ ('OR'),
          __type: FILTER_TYPE.STANDARD,
          value: {
            b: { __type: FILTER_TYPE.RANGE, lowerBound: 0, upperBound: 1 },
          },
        },
      ],
    };
    const gqlFilter = {
      AND: [
        {
          OR: [
            {
              AND: [{ IN: { a: ['foo', 'bar'] } }],
            },
          ],
        },
        {
          OR: [{ AND: [{ GTE: { b: 0 } }, { LTE: { b: 1 } }] }],
        },
      ],
    };
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });

  test('a higher-order exclusion composed filter', () => {
    const filterState = {
      __combineMode: /** @type {CombineMode} */ ('AND'),
      __type: FILTER_TYPE.COMPOSED,
      value: [
        {
          __combineMode: /** @type {CombineMode} */ ('OR'),
          __type: FILTER_TYPE.COMPOSED,
          value: [
            {
              __combineMode: /** @type {CombineMode} */ ('AND'),
              __type: FILTER_TYPE.STANDARD,
              value: {
                a: {
                  __type: FILTER_TYPE.OPTION,
                  selectedValues: ['foo', 'bar'],
                  isExclusion: true,
                },
              },
            },
          ],
        },
        {
          __combineMode: /** @type {CombineMode} */ ('OR'),
          __type: FILTER_TYPE.STANDARD,
          value: {
            b: { __type: FILTER_TYPE.RANGE, lowerBound: 0, upperBound: 1 },
          },
        },
      ],
    };
    const gqlFilter = {
      AND: [
        {
          OR: [
            {
              AND: [
                {
                  AND: [
                    {
                      '!=': {
                        a: 'foo',
                      },
                    },
                    {
                      '!=': {
                        a: 'bar',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          OR: [{ AND: [{ GTE: { b: 0 } }, { LTE: { b: 1 } }] }],
        },
      ],
    };
    expect(getGQLFilter(filterState)).toEqual(gqlFilter);
  });
});

describe('Get query info objects for aggregation options data', () => {
  const anchorConfig = {
    field: 'a',
    tabs: ['t1'],
    options: ['a0', 'a1'],
  };
  const anchorValue = anchorConfig.options[0];
  const filterTabs = [
    { title: 't0', fields: ['f0', 'f1'] },
    { title: 't1', fields: ['f2.foo', 'f2.bar', 'f3.baz'] },
  ];
  const anchoredFilterTabs = filterTabs.filter(({ title }) =>
    anchorConfig.tabs.includes(title)
  );
  const gqlFilter = {
    AND: [
      { IN: { f0: ['x'] } },
      { AND: [{ GTE: { f1: 0 } }, { LTE: { f1: 1 } }] },
      {
        nested: {
          path: 'f2',
          AND: [{ IN: { foo: ['y'] } }],
        },
      },
    ],
  };
  test('No filter, no anchor config', () => {
    const queryInfo = getQueryInfoForAggregationOptionsData({
      filterTabs,
    });
    const expected = {
      fieldsByGroup: { main: ['f0', 'f1', 'f2.foo', 'f2.bar', 'f3.baz'] },
      gqlFilterByGroup: { filter_main: undefined },
    };
    expect(queryInfo).toEqual(expected);
  });
  test('No filter, no anchor value', () => {
    const queryInfo = getQueryInfoForAggregationOptionsData({
      anchorConfig,
      filterTabs,
    });
    const expected = {
      fieldsByGroup: { main: ['f0', 'f1', 'f2.foo', 'f2.bar', 'f3.baz'] },
      gqlFilterByGroup: { filter_main: undefined },
    };
    expect(queryInfo).toEqual(expected);
  });
  test('No filter, no anchor value, anchored tabs only', () => {
    const queryInfo = getQueryInfoForAggregationOptionsData({
      anchorConfig,
      filterTabs: anchoredFilterTabs,
    });
    const expected = {
      fieldsByGroup: { main: ['f2.foo', 'f2.bar', 'f3.baz'] },
      gqlFilterByGroup: { filter_main: undefined },
    };
    expect(queryInfo).toEqual(expected);
  });
  test('No filter, with anchor value', () => {
    const queryInfo = getQueryInfoForAggregationOptionsData({
      anchorConfig,
      anchorValue,
      filterTabs,
    });
    const expected = {
      fieldsByGroup: {
        main: ['f0', 'f1'],
        f2: ['f2.foo', 'f2.bar'],
        f3: ['f3.baz'],
      },
      gqlFilterByGroup: {
        filter_main: undefined,
        filter_f2: {
          AND: [{ nested: { path: 'f2', AND: [{ IN: { a: ['a0'] } }] } }],
        },
        filter_f3: {
          AND: [{ nested: { path: 'f3', AND: [{ IN: { a: ['a0'] } }] } }],
        },
      },
    };
    expect(queryInfo).toEqual(expected);
  });
  test('No filter, with anchor value, anchored tabs only', () => {
    const queryInfo = getQueryInfoForAggregationOptionsData({
      anchorConfig,
      anchorValue,
      filterTabs: anchoredFilterTabs,
    });
    const expected = {
      fieldsByGroup: {
        f2: ['f2.foo', 'f2.bar'],
        f3: ['f3.baz'],
      },
      gqlFilterByGroup: {
        filter_main: undefined,
        filter_f2: {
          AND: [{ nested: { path: 'f2', AND: [{ IN: { a: ['a0'] } }] } }],
        },
        filter_f3: {
          AND: [{ nested: { path: 'f3', AND: [{ IN: { a: ['a0'] } }] } }],
        },
      },
    };
    expect(queryInfo).toEqual(expected);
  });
  test('With filter, no anchor config', () => {
    const queryInfo = getQueryInfoForAggregationOptionsData({
      filterTabs,
      gqlFilter,
    });
    const expected = {
      fieldsByGroup: { main: ['f0', 'f1', 'f2.foo', 'f2.bar', 'f3.baz'] },
      gqlFilterByGroup: { filter_main: gqlFilter },
    };
    expect(queryInfo).toEqual(expected);
  });
  test('With filter, no anchor value', () => {
    const queryInfo = getQueryInfoForAggregationOptionsData({
      anchorConfig,
      filterTabs,
      gqlFilter,
    });
    const expected = {
      fieldsByGroup: { main: ['f0', 'f1', 'f2.foo', 'f2.bar', 'f3.baz'] },
      gqlFilterByGroup: { filter_main: gqlFilter },
    };
    expect(queryInfo).toEqual(expected);
  });
  test('With filter, no anchor value, anchored tabs only', () => {
    const queryInfo = getQueryInfoForAggregationOptionsData({
      anchorConfig,
      filterTabs: anchoredFilterTabs,
      gqlFilter,
    });
    const expected = {
      fieldsByGroup: { main: ['f2.foo', 'f2.bar', 'f3.baz'] },
      gqlFilterByGroup: { filter_main: gqlFilter },
    };
    expect(queryInfo).toEqual(expected);
  });
  test('With filter, with anchor value', () => {
    const gqlFilterWithAnchor = {
      AND: [
        { IN: { f0: ['x'] } },
        { AND: [{ GTE: { f1: 0 } }, { LTE: { f1: 1 } }] },
        {
          nested: {
            path: 'f2',
            AND: [
              {
                AND: [{ IN: { a: ['a0'] } }, { AND: [{ IN: { foo: ['y'] } }] }],
              },
            ],
          },
        },
      ],
    };
    const queryInfo = getQueryInfoForAggregationOptionsData({
      anchorConfig,
      anchorValue,
      filterTabs,
      gqlFilter: gqlFilterWithAnchor,
    });
    const expected = {
      fieldsByGroup: {
        main: ['f0', 'f1'],
        f2: ['f2.foo', 'f2.bar'],
        f3: ['f3.baz'],
      },
      gqlFilterByGroup: {
        filter_main: gqlFilterWithAnchor,
        filter_f2: {
          AND: [
            ...gqlFilterWithAnchor.AND.slice(0, 2),
            {
              nested: {
                path: 'f2',
                AND: [
                  {
                    AND: [
                      { IN: { a: ['a0'] } },
                      { AND: [{ IN: { foo: ['y'] } }] },
                    ],
                  },
                  { IN: { a: ['a0'] } },
                ],
              },
            },
          ],
        },
        filter_f3: {
          AND: [
            ...gqlFilterWithAnchor.AND,
            { nested: { path: 'f3', AND: [{ IN: { a: ['a0'] } }] } },
          ],
        },
      },
    };
    expect(queryInfo).toEqual(expected);
  });
});
