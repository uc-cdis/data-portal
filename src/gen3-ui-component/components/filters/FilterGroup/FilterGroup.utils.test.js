import {
  getExpandedStatus,
  getFilterResultsByAnchor,
  getFilterStatus,
  clearFilterSection,
  removeEmptyFilter,
  tabHasActiveFilters,
  updateCombineMode,
  updateRangeValue,
  updateSelectedValue,
  getSelectedAnchors,
} from './utils';

/** @typedef {import('../types').FilterState} FilterState */
/** @typedef {import('../types').FilterStatus} FilterStatus */
/** @typedef {import('../types').FilterTabsOption} FilterTabsOption */

describe('Get expanded status array for all tabs', () => {
  const filterTabs = [
    { title: 'a', fields: ['x', 'y'] },
    { title: 'b', fields: ['z'] },
  ];
  test('Expanding all filters', () => {
    const expanded = getExpandedStatus(filterTabs, true);
    const expected = [[true, true], [true]];
    expect(expanded).toEqual(expected);
  });
  test('Collapsing all filters', () => {
    const collapsed = getExpandedStatus(filterTabs, false);
    const expected = [[false, false], [false]];
    expect(collapsed).toEqual(expected);
  });
});

describe('Get filter results by anchor label', () => {
  test('Missing anchor config', () => {
    const received = getFilterResultsByAnchor({
      filterResults: {
        value: {
          x: { selectedValues: ['foo', 'bar'] },
          y: { lowerBound: 0, upperBound: 1 },
        },
      },
    });
    const expected = {
      '': {
        value: {
          x: { selectedValues: ['foo', 'bar'] },
          y: { lowerBound: 0, upperBound: 1 },
        },
      },
    };
    expect(received).toEqual(expected);
  });
  const anchorConfig = {
    field: 'a',
    options: ['a0', 'a1'],
    tabs: ['t1'],
  };
  test('Filter results with no anchor only', () => {
    const received = getFilterResultsByAnchor({
      anchorConfig,
      filterResults: {
        value: {
          x: { selectedValues: ['foo', 'bar'] },
          y: { lowerBound: 0, upperBound: 1 },
        },
      },
    });
    const expected = {
      '': {
        value: {
          x: { selectedValues: ['foo', 'bar'] },
          y: { lowerBound: 0, upperBound: 1 },
        },
      },
      'a:a0': { value: {} },
      'a:a1': { value: {} },
    };
    expect(received).toEqual(expected);
  });
  test('Filter results with a single anchor label only', () => {
    const received = getFilterResultsByAnchor({
      anchorConfig,
      filterResults: {
        value: {
          'a:a0': {
            filter: {
              value: {
                x: { selectedValues: ['foo'] },
                y: { lowerBound: 0, upperBound: 1 },
              },
            },
          },
        },
      },
    });
    const expected = {
      '': { value: {} },
      'a:a0': {
        value: {
          x: { selectedValues: ['foo'] },
          y: { lowerBound: 0, upperBound: 1 },
        },
      },
      'a:a1': { value: {} },
    };
    expect(received).toEqual(expected);
  });
  test('Filter result with multiple anchor labels only', () => {
    const received = getFilterResultsByAnchor({
      anchorConfig,
      filterResults: {
        value: {
          'a:a0': {
            filter: {
              value: { x: { selectedValues: ['foo'] } },
            },
          },
          'a:a1': {
            filter: {
              value: {
                y: { lowerBound: 0, upperBound: 1 },
              },
            },
          },
        },
      },
    });
    const expected = {
      '': { value: {} },
      'a:a0': {
        value: {
          x: { selectedValues: ['foo'] },
        },
      },
      'a:a1': {
        value: {
          y: { lowerBound: 0, upperBound: 1 },
        },
      },
    };
    expect(received).toEqual(expected);
  });
});

describe('Get filter status from filter results', () => {
  test('Single tab, single option filter', () => {
    const filterResults = { value: { x: { selectedValues: ['foo', 'bar'] } } };
    const filterTabs = [{ title: 'a', fields: ['x'] }];
    const filerStatus = getFilterStatus({ filterResults, filterTabs });
    const expected = [[{ foo: true, bar: true }]];
    expect(filerStatus).toEqual(expected);
  });
  test('Single tab, single range filter', () => {
    const filterResults = { value: { x: { lowerBound: 0, upperBound: 1 } } };
    const filterTabs = [{ title: 'a', fields: ['x'] }];
    const filerStatus = getFilterStatus({ filterResults, filterTabs });
    const expected = [[[0, 1]]];
    expect(filerStatus).toEqual(expected);
  });
  test('Single tab, multiple filters', () => {
    const filterResults = {
      value: {
        x: { selectedValues: ['foo', 'bar'] },
        y: { lowerBound: 0, upperBound: 1 },
      },
    };
    const filterTabs = [{ title: 'a', fields: ['x', 'y'] }];
    const filerStatus = getFilterStatus({ filterResults, filterTabs });
    const expected = [[{ foo: true, bar: true }, [0, 1]]];
    expect(filerStatus).toEqual(expected);
  });
  test('Multiple tabs', () => {
    const filterResults = {
      value: {
        x: { selectedValues: ['foo', 'bar'] },
        y: { lowerBound: 0, upperBound: 1 },
        z: { selectedValues: ['baz'] },
      },
    };
    const filterTabs = [
      { title: 'a', fields: ['x', 'z'] },
      { title: 'b', fields: ['y'] },
    ];
    const filerStatus = getFilterStatus({ filterResults, filterTabs });
    const expected = [[{ foo: true, bar: true }, { baz: true }], [[0, 1]]];
    expect(filerStatus).toEqual(expected);
  });
  test('Single anchored tab', () => {
    const anchorConfig = {
      field: 'a',
      options: ['a0', 'a1'],
      tabs: ['t'],
    };
    const filterResults = {
      value: {
        'a:a0': {
          filter: {
            value: { x: { selectedValues: ['foo', 'bar'] } },
          },
        },
        'a:a1': {
          filter: {
            value: { y: { lowerBound: 0, upperBound: 1 } },
          },
        },
      },
    };
    const filterTabs = [{ title: 't', fields: ['x', 'y'] }];
    const filerStatus = getFilterStatus({
      anchorConfig,
      filterResults,
      filterTabs,
    });
    const expected = [
      {
        '': [{}, {}],
        'a:a0': [{ foo: true, bar: true }, {}],
        'a:a1': [{}, [0, 1]],
      },
    ];
    expect(filerStatus).toEqual(expected);
  });
  test('Multiple anchored tabs', () => {
    const anchorConfig = {
      field: 'a',
      options: ['a0', 'a1'],
      tabs: ['t0', 't1'],
    };
    const filterResults = {
      value: {
        'a:a0': {
          filter: {
            value: { x: { selectedValues: ['foo', 'bar'] } },
          },
        },
        'a:a1': {
          filter: {
            value: {
              y: { lowerBound: 0, upperBound: 1 },
              z: { selectedValues: ['baz'] },
            },
          },
        },
      },
    };
    const filterTabs = [
      { title: 't0', fields: ['x', 'z'] },
      { title: 't1', fields: ['y'] },
    ];
    const filerStatus = getFilterStatus({
      anchorConfig,
      filterResults,
      filterTabs,
    });
    const expected = [
      {
        '': [{}, {}],
        'a:a0': [{ foo: true, bar: true }, {}],
        'a:a1': [{}, { baz: true }],
      },
      {
        '': [{}],
        'a:a0': [{}],
        'a:a1': [[0, 1]],
      },
    ];
    expect(filerStatus).toEqual(expected);
  });
  test('Multiple tabs, both anchored and not', () => {
    const anchorConfig = {
      field: 'a',
      options: ['a0', 'a1'],
      tabs: ['t1', 't2'],
    };
    const filterResults = {
      value: {
        x: { selectedValues: ['foo', 'bar'] },
        'a:a0': {
          filter: {
            value: {
              y: { lowerBound: 0, upperBound: 1 },
              z: { selectedValues: ['baz'] },
            },
          },
        },
        'a:a1': {
          filter: {
            value: {
              z: { selectedValues: ['baz'] },
            },
          },
        },
      },
    };
    const filterTabs = [
      { title: 't0', fields: ['x'] },
      { title: 't1', fields: ['y'] },
      { title: 't2', fields: ['z'] },
    ];
    const filerStatus = getFilterStatus({
      anchorConfig,
      filterResults,
      filterTabs,
    });
    const expected = [
      [{ foo: true, bar: true }],
      {
        '': [{}],
        'a:a0': [[0, 1]],
        'a:a1': [{}],
      },
      {
        '': [{}],
        'a:a0': [{ baz: true }],
        'a:a1': [{ baz: true }],
      },
    ];
    expect(filerStatus).toEqual(expected);
  });
});

describe('Clear a single filter section', () => {
  /**
   * @param {Object} args
   * @param {string} [args.anchorLabel]
   * @param {FilterState} [args.filterResults]
   * @param {FilterStatus} [args.filterStatus]
   * @param {FilterTabsOption[]} [args.filterTabs]
   * @param {number} args.sectionIndex
   * @param {number} args.tabIndex
   */
  function helper({
    filterResults = {
      value: {
        x: { selectedValues: ['foo', 'bar'] },
        y: { lowerBound: 0, upperBound: 1 },
        z: { selectedValues: ['baz'] },
      },
    },
    filterStatus = [[{ foo: true, bar: true }, { baz: true }], [[0, 1]]],
    filterTabs = [
      { title: 't0', fields: ['x', 'z'] },
      { title: 't1', fields: ['y'] },
    ],
    tabIndex,
    anchorLabel,
    sectionIndex,
  }) {
    return clearFilterSection({
      filterResults,
      filterStatus,
      filterTabs,
      tabIndex,
      anchorLabel,
      sectionIndex,
    });
  }
  test('Option filter', () => {
    const cleared = helper({
      tabIndex: 0,
      sectionIndex: 0,
    });
    const expected = {
      filterStatus: [[{}, { baz: true }], [[0, 1]]],
      filterResults: {
        value: {
          y: { lowerBound: 0, upperBound: 1 },
          z: { selectedValues: ['baz'] },
        },
      },
    };
    expect(cleared).toEqual(expected);
  });
  test('Range filter', () => {
    const cleared = helper({
      tabIndex: 1,
      sectionIndex: 0,
    });
    const expected = {
      filterStatus: [[{ foo: true, bar: true }, { baz: true }], [{}]],
      filterResults: {
        value: {
          x: { selectedValues: ['foo', 'bar'] },
          z: { selectedValues: ['baz'] },
        },
      },
    };
    expect(cleared).toEqual(expected);
  });
  test('Anchored filter', () => {
    const cleared = helper({
      filterResults: {
        value: {
          x: { selectedValues: ['foo', 'bar'] },
          z: { selectedValues: ['baz'] },
          'a:a0': {
            filter: {
              value: { y: { lowerBound: 0, upperBound: 1 } },
            },
          },
        },
      },
      filterStatus: [
        [{ foo: true, bar: true }, { baz: true }],
        { '': [{}], 'a:a0': [[0, 1]] },
      ],
      anchorLabel: 'a:a0',
      tabIndex: 1,
      sectionIndex: 0,
    });
    const expected = {
      filterStatus: [
        [{ foo: true, bar: true }, { baz: true }],
        { '': [{}], 'a:a0': [{}] },
      ],
      filterResults: {
        value: {
          x: { selectedValues: ['foo', 'bar'] },
          z: { selectedValues: ['baz'] },
        },
      },
    };
    expect(cleared).toEqual(expected);
  });
});

describe('Remove empty filter in filter results', () => {
  test('Single empty filter', () => {
    const removed = removeEmptyFilter({
      value: {
        x: { selectedValues: ['foo', 'bar'] },
        y: {},
        z: { __combineMode: 'AND' },
      },
    });
    const expected = {
      value: {
        x: { selectedValues: ['foo', 'bar'] },
        z: { __combineMode: 'AND' },
      },
    };
    expect(removed).toEqual(expected);
  });
  test('Multiple empty filters', () => {
    const removed = removeEmptyFilter({
      value: {
        x: {},
        y: { lowerBound: 0, upperBound: 1 },
        z: {},
      },
    });
    const expected = {
      value: {
        y: { lowerBound: 0, upperBound: 1 },
      },
    };
    expect(removed).toEqual(expected);
  });
  test('Single empty filter with anchor', () => {
    const removed = removeEmptyFilter({
      value: {
        'a:a0': {
          filter: {
            value: {
              x: {},
              y: { lowerBound: 0, upperBound: 1 },
              z: { __combineMode: 'AND' },
            },
          },
        },
      },
    });
    const expected = {
      value: {
        'a:a0': {
          filter: {
            value: {
              y: { lowerBound: 0, upperBound: 1 },
              z: { __combineMode: 'AND' },
            },
          },
        },
      },
    };
    expect(removed).toEqual(expected);
  });
  test('Empty filters only with anchor', () => {
    const removed = removeEmptyFilter({
      value: {
        'a:a0': {
          filter: {
            value: {
              x: {},
              y: {},
            },
          },
        },
      },
    });
    const expected = { value: {} };
    expect(removed).toEqual(expected);
  });
  test('Empty filters with and without anchor', () => {
    const removed = removeEmptyFilter({
      value: {
        x: { selectedValues: ['foo', 'bar'] },
        y: {},
        'a:a0': {
          filter: {
            value: {
              x: {},
              y: { lowerBound: 0, upperBound: 1 },
            },
          },
        },
      },
    });
    const expected = {
      value: {
        x: { selectedValues: ['foo', 'bar'] },
        'a:a0': {
          filter: {
            value: {
              y: { lowerBound: 0, upperBound: 1 },
            },
          },
        },
      },
    };
    expect(removed).toEqual(expected);
  });
});

describe('Check if a tab has active filter', () => {
  test('No active filter', () => {
    const filterTabStatus = [{ foo: false }, {}];
    const hasActiveFilters = tabHasActiveFilters(filterTabStatus);
    expect(hasActiveFilters).toEqual(false);
  });
  test('One active option filter', () => {
    const filterTabStatus = [{ foo: true }, {}];
    const hasActiveFilters = tabHasActiveFilters(filterTabStatus);
    expect(hasActiveFilters).toEqual(true);
  });
  test('One active range filter', () => {
    const filterTabStatus = [{}, [0, 1]];
    const hasActiveFilters = tabHasActiveFilters(filterTabStatus);
    expect(hasActiveFilters).toEqual(true);
  });
  test('No active anchored filter', () => {
    const filterTabStatus = { '': [{}, {}], 'a:a0': [{}, {}] };
    const hasActiveFilters = tabHasActiveFilters(filterTabStatus);
    expect(hasActiveFilters).toEqual(false);
  });
  test('One active anchored range filter', () => {
    const filterTabStatus = { '': [{}, {}], 'a:a0': [{}, [0, 1]] };
    const hasActiveFilters = tabHasActiveFilters(filterTabStatus);
    expect(hasActiveFilters).toEqual(true);
  });
});

describe('Toggles combine mode in option filter', () => {
  /**
   * @param {Object} args
   * @param {FilterStatus} args.filterStatus
   * @param {FilterState} args.filterResults
   * @param {string} [args.anchorLabel]
   * @param {'AND' | 'OR'} args.combineModeValue
   */
  function helper({
    filterStatus,
    filterResults,
    anchorLabel,
    combineModeValue,
  }) {
    return updateCombineMode({
      filterStatus,
      filterResults,
      filterTabs: [{ title: 'a', fields: ['x'] }],
      tabIndex: 0,
      anchorLabel,
      sectionIndex: 0,
      combineModeFieldName: '__combineMode',
      combineModeValue,
    });
  }
  test('Missing combine mode', () => {
    const updated = helper({
      filterStatus: [[{ foo: true }]],
      filterResults: {
        value: {
          x: { selectedValues: ['foo'] },
        },
      },
      combineModeValue: 'OR',
    });
    const expected = {
      filterResults: {
        value: {
          x: { selectedValues: ['foo'], __combineMode: 'OR' },
        },
      },
      filterStatus: [[{ foo: true, __combineMode: 'OR' }]],
    };
    expect(updated).toEqual(expected);
  });
  test('Existing combine mode', () => {
    const updated = helper({
      filterStatus: [[{ foo: true, __combineMode: 'OR' }]],
      filterResults: {
        value: {
          x: { selectedValues: ['foo'], __combineMode: 'OR' },
        },
      },
      combineModeValue: 'AND',
    });
    const expected = {
      filterResults: {
        value: {
          x: { selectedValues: ['foo'], __combineMode: 'AND' },
        },
      },
      filterStatus: [[{ foo: true, __combineMode: 'AND' }]],
    };
    expect(updated).toEqual(expected);
  });
  test('Missing combine mode in anchored filter', () => {
    const updated = helper({
      filterStatus: [{ '': [{}], 'a:a0': [{ foo: true }] }],
      filterResults: {
        value: {
          'a:a0': {
            filter: {
              value: {
                x: { selectedValues: ['foo'] },
              },
            },
          },
        },
      },
      anchorLabel: 'a:a0',
      combineModeValue: 'AND',
    });
    const expected = {
      filterResults: {
        value: {
          'a:a0': {
            filter: {
              value: {
                x: { selectedValues: ['foo'], __combineMode: 'AND' },
              },
            },
          },
        },
      },
      filterStatus: [
        { '': [{}], 'a:a0': [{ foo: true, __combineMode: 'AND' }] },
      ],
    };
    expect(updated).toEqual(expected);
  });
  test('Missing anchored filter', () => {
    const updated = helper({
      filterStatus: [{ '': [{}], 'a:a0': [{}] }],
      filterResults: { value: {} },
      anchorLabel: 'a:a0',
      combineModeValue: 'AND',
    });
    const expected = {
      filterResults: {
        value: {
          'a:a0': {
            filter: {
              value: {
                x: { __combineMode: 'AND' },
              },
            },
          },
        },
      },
      filterStatus: [{ '': [{}], 'a:a0': [{ __combineMode: 'AND' }] }],
    };
    expect(updated).toEqual(expected);
  });
  test('Exisiting combine mode in anchored filter', () => {
    const updated = helper({
      filterStatus: [
        { '': [{}], 'a:a0': [{ foo: true, __combineMode: 'OR' }] },
      ],
      filterResults: {
        value: {
          'a:a0': {
            filter: {
              value: {
                x: { selectedValues: ['foo'], __combineMode: 'OR' },
              },
            },
          },
        },
      },
      anchorLabel: 'a:a0',
      combineModeValue: 'AND',
    });
    const expected = {
      filterResults: {
        value: {
          'a:a0': {
            filter: {
              value: {
                x: { selectedValues: ['foo'], __combineMode: 'AND' },
              },
            },
          },
        },
      },
      filterStatus: [
        { '': [{}], 'a:a0': [{ foo: true, __combineMode: 'AND' }] },
      ],
    };
    expect(updated).toEqual(expected);
  });
});

describe('Update a range filter', () => {
  const [minValue, maxValue] = [0, 5];
  /**
   * @param {Object} args
   * @param {FilterStatus} [args.filterStatus]
   * @param {FilterState} [args.filterResults]
   * @param {string} [args.anchorLabel]
   * @param {number} args.lowerBound
   * @param {number} args.upperBound
   */
  function helper({
    filterStatus = [[[0, 1]]],
    filterResults = {
      value: {
        x: { lowerBound: 0, upperBound: 1 },
      },
    },
    anchorLabel,
    lowerBound,
    upperBound,
  }) {
    return updateRangeValue({
      filterStatus,
      filterResults,
      filterTabs: [{ title: 't', fields: ['x'] }],
      tabIndex: 0,
      anchorLabel,
      sectionIndex: 0,
      lowerBound,
      upperBound,
      minValue,
      maxValue,
      rangeStep: 1,
    });
  }
  test('Simple update', () => {
    const updated = helper({
      lowerBound: 1,
      upperBound: 2,
    });
    const expected = {
      filterResults: {
        value: { x: { lowerBound: 1, upperBound: 2 } },
      },
      filterStatus: [[[1, 2]]],
    };
    expect(updated).toEqual(expected);
  });
  test('lowerBound and upperBound equal max and min values', () => {
    const updated = helper({
      lowerBound: minValue,
      upperBound: maxValue,
    });
    const expected = {
      filterResults: { value: {} },
      filterStatus: [[[minValue, maxValue]]],
    };
    expect(updated).toEqual(expected);
  });
  test('Simple update in anchored filter', () => {
    const updated = helper({
      filterStatus: [{ 'a:a0': [[0, 1]] }],
      filterResults: {
        value: {
          'a:a0': {
            filter: {
              value: {
                x: { lowerBound: 0, upperBound: 1 },
              },
            },
          },
        },
      },
      anchorLabel: 'a:a0',
      lowerBound: 1,
      upperBound: 2,
    });
    const expected = {
      filterResults: {
        value: {
          'a:a0': {
            filter: {
              value: {
                x: { lowerBound: 1, upperBound: 2 },
              },
            },
          },
        },
      },
      filterStatus: [{ 'a:a0': [[1, 2]] }],
    };
    expect(updated).toEqual(expected);
  });
  test('Simple update in missing anchored filter', () => {
    const updated = helper({
      filterStatus: [{ 'a:a0': [{}] }],
      filterResults: { value: {} },
      anchorLabel: 'a:a0',
      lowerBound: 1,
      upperBound: 2,
    });
    const expected = {
      filterResults: {
        value: {
          'a:a0': {
            filter: {
              value: { x: { lowerBound: 1, upperBound: 2 } },
            },
          },
        },
      },
      filterStatus: [{ 'a:a0': [[1, 2]] }],
    };
    expect(updated).toEqual(expected);
  });
  test('lowerBound and upperBound equal max and min values in anchored filter', () => {
    const updated = helper({
      filterStatus: [{ 'a:a0': [[0, 1]] }],
      filterResults: {
        value: {
          'a:a0': {
            filter: {
              value: {
                x: { lowerBound: 0, upperBound: 1 },
              },
            },
          },
        },
      },
      anchorLabel: 'a:a0',
      lowerBound: minValue,
      upperBound: maxValue,
    });
    const expected = {
      filterResults: { value: {} },
      filterStatus: [{ 'a:a0': [[minValue, maxValue]] }],
    };
    expect(updated).toEqual(expected);
  });
});

describe('Update an option filter', () => {
  /**
   * @param {Object} args
   * @param {FilterStatus} args.filterStatus
   * @param {FilterState} args.filterResults
   * @param {string} [args.anchorLabel]
   * @param {string} args.selectedValue
   */
  function helper({ filterStatus, filterResults, anchorLabel, selectedValue }) {
    return updateSelectedValue({
      filterStatus,
      filterResults,
      filterTabs: [{ title: 'a', fields: ['x'] }],
      tabIndex: 0,
      anchorLabel,
      sectionIndex: 0,
      selectedValue,
    });
  }
  test('Select value', () => {
    const updated = helper({
      filterStatus: [[{}]],
      filterResults: { value: {} },
      selectedValue: 'foo',
    });
    const expected = {
      filterResults: {
        value: {
          x: { selectedValues: ['foo'] },
        },
      },
      filterStatus: [[{ foo: true }]],
    };
    expect(updated).toEqual(expected);
  });
  test('Unselect value', () => {
    const updated = helper({
      filterStatus: [[{ foo: true }]],
      filterResults: {
        value: {
          x: { selectedValues: ['foo'] },
        },
      },
      selectedValue: 'foo',
    });
    const expected = {
      filterResults: { value: {} },
      filterStatus: [[{ foo: false }]],
    };
    expect(updated).toEqual(expected);
  });
  test('Select value in anchored filter', () => {
    const updated = helper({
      filterStatus: [{ 'a:a0': [{}] }],
      filterResults: { value: {} },
      anchorLabel: 'a:a0',
      selectedValue: 'foo',
    });
    const expected = {
      filterResults: {
        value: {
          'a:a0': {
            filter: {
              value: {
                x: { selectedValues: ['foo'] },
              },
            },
          },
        },
      },
      filterStatus: [{ 'a:a0': [{ foo: true }] }],
    };
    expect(updated).toEqual(expected);
  });
  test('Unselect value in anchored filter', () => {
    const updated = helper({
      filterStatus: [{ 'a:a0': [{ foo: true }] }],
      filterResults: {
        value: {
          'a:a0': {
            filter: {
              value: {
                x: { selectedValues: ['foo'] },
              },
            },
          },
        },
      },
      anchorLabel: 'a:a0',
      selectedValue: 'foo',
    });
    const expected = {
      filterResults: { value: {} },
      filterStatus: [{ 'a:a0': [{ foo: false }] }],
    };
    expect(updated).toEqual(expected);
  });
});

describe('Get selected anchor values from filter status', () => {
  test('No filter selected', () => {
    const filterStatus = [
      [{}],
      {
        '': [{}, {}],
        'a:a0': [{}, {}],
        'a:a1': [{}, {}],
      },
    ];
    const anchors = getSelectedAnchors(filterStatus);
    const expected = [[], []];
    expect(anchors).toEqual(expected);
  });
  test('With non-anchored filter selected', () => {
    const anchors = getSelectedAnchors([
      [{ x: true }],
      {
        '': [{}, {}],
        'a:a0': [{}, {}],
        'a:a1': [{}, {}],
      },
    ]);
    const expected = [[], []];
    expect(anchors).toEqual(expected);
  });
  test('With anchored filter without anchor value selected', () => {
    const anchors = getSelectedAnchors([
      [{}],
      {
        '': [{ y: true }, {}],
        'a:a0': [{}, {}],
        'a:a1': [{}, {}],
      },
    ]);
    const expected = [[], []];
    expect(anchors).toEqual(expected);
  });
  test('With anchored filter with anchor value selected', () => {
    const anchors = getSelectedAnchors([
      [{}, {}],
      {
        '': [{ y: true }, {}],
        'a:a0': [{}, { z: true }],
        'a:a1': [{}, {}],
      },
    ]);
    const expected = [[], ['a0']];
    expect(anchors).toEqual(expected);
  });
  test('With anchored filter with multiple anchor values selected', () => {
    const anchors = getSelectedAnchors([
      [{}, {}],
      {
        '': [{ y: true }, {}],
        'a:a0': [{}, { z: true }],
        'a:a1': [{ y: true }, {}],
      },
    ]);
    const expected = [[], ['a0', 'a1']];
    expect(anchors).toEqual(expected);
  });
});
