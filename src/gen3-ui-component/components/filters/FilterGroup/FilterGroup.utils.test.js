import {
  getExpandedStatus,
  getFilterResultsByAnchor,
  getFilterStatus,
  clearFilterSection,
  removeEmptyFilter,
  tabHasActiveFilters,
  toggleCombineOption,
  updateRangeValue,
  updateSelectedValue,
} from './utils';

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
        x: { selectedValues: ['foo', 'bar'] },
        y: { lowerBound: 0, upperBound: 1 },
      },
    });
    const expected = {
      '': {
        x: { selectedValues: ['foo', 'bar'] },
        y: { lowerBound: 0, upperBound: 1 },
      },
    };
    expect(received).toEqual(expected);
  });
  const anchorConfig = {
    fieldName: 'a',
    options: ['a0', 'a1'],
    tabs: ['t1'],
  };
  test('Filter results with no anchor only', () => {
    const received = getFilterResultsByAnchor({
      anchorConfig,
      filterResults: {
        x: { selectedValues: ['foo', 'bar'] },
        y: { lowerBound: 0, upperBound: 1 },
      },
    });
    const expected = {
      '': {
        x: { selectedValues: ['foo', 'bar'] },
        y: { lowerBound: 0, upperBound: 1 },
      },
      'a:a0': {},
      'a:a1': {},
    };
    expect(received).toEqual(expected);
  });
  test('Filter results with a single anchor label only', () => {
    const received = getFilterResultsByAnchor({
      anchorConfig,
      filterResults: {
        'a:a0': {
          filter: {
            x: { selectedValues: ['foo'] },
            y: { lowerBound: 0, upperBound: 1 },
          },
        },
      },
    });
    const expected = {
      '': {},
      'a:a0': {
        x: { selectedValues: ['foo'] },
        y: { lowerBound: 0, upperBound: 1 },
      },
      'a:a1': {},
    };
    expect(received).toEqual(expected);
  });
  test('Filter result with multiple anchor labels only', () => {
    const received = getFilterResultsByAnchor({
      anchorConfig,
      filterResults: {
        'a:a0': { filter: { x: { selectedValues: ['foo'] } } },
        'a:a1': { filter: { y: { lowerBound: 0, upperBound: 1 } } },
      },
    });
    const expected = {
      '': {},
      'a:a0': { x: { selectedValues: ['foo'] } },
      'a:a1': { y: { lowerBound: 0, upperBound: 1 } },
    };
    expect(received).toEqual(expected);
  });
});

describe('Get filter status from filter results', () => {
  test('Single tab, single option filter', () => {
    const filterResults = { x: { selectedValues: ['foo', 'bar'] } };
    const filterTabs = [{ title: 'a', fields: ['x'] }];
    const filerStatus = getFilterStatus({ filterResults, filterTabs });
    const expected = [[{ foo: true, bar: true }]];
    expect(filerStatus).toEqual(expected);
  });
  test('Single tab, single range filter', () => {
    const filterResults = { x: { lowerBound: 0, upperBound: 1 } };
    const filterTabs = [{ title: 'a', fields: ['x'] }];
    const filerStatus = getFilterStatus({ filterResults, filterTabs });
    const expected = [[[0, 1]]];
    expect(filerStatus).toEqual(expected);
  });
  test('Single tab, multiple filters', () => {
    const filterResults = {
      x: { selectedValues: ['foo', 'bar'] },
      y: { lowerBound: 0, upperBound: 1 },
    };
    const filterTabs = [{ title: 'a', fields: ['x', 'y'] }];
    const filerStatus = getFilterStatus({ filterResults, filterTabs });
    const expected = [[{ foo: true, bar: true }, [0, 1]]];
    expect(filerStatus).toEqual(expected);
  });
  test('Multiple tabs', () => {
    const filterResults = {
      x: { selectedValues: ['foo', 'bar'] },
      y: { lowerBound: 0, upperBound: 1 },
      z: { selectedValues: ['baz'] },
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
      fieldName: 'a',
      options: ['a0', 'a1'],
      tabs: ['t'],
    };
    const filterResults = {
      'a:a0': { filter: { x: { selectedValues: ['foo', 'bar'] } } },
      'a:a1': { filter: { y: { lowerBound: 0, upperBound: 1 } } },
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
      fieldName: 'a',
      options: ['a0', 'a1'],
      tabs: ['t0', 't1'],
    };
    const filterResults = {
      'a:a0': { filter: { x: { selectedValues: ['foo', 'bar'] } } },
      'a:a1': {
        filter: {
          y: { lowerBound: 0, upperBound: 1 },
          z: { selectedValues: ['baz'] },
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
      fieldName: 'a',
      options: ['a0', 'a1'],
      tabs: ['t1', 't2'],
    };
    const filterResults = {
      x: { selectedValues: ['foo', 'bar'] },
      'a:a0': {
        filter: {
          y: { lowerBound: 0, upperBound: 1 },
          z: { selectedValues: ['baz'] },
        },
      },
      'a:a1': {
        filter: {
          z: { selectedValues: ['baz'] },
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
  function helper({ tabIndex, sectionIndex }) {
    return clearFilterSection({
      filterResults: {
        x: { selectedValues: ['foo', 'bar'] },
        y: { lowerBound: 0, upperBound: 1 },
        z: { selectedValues: ['baz'] },
      },
      filterStatus: [[{ foo: true, bar: true }, { baz: true }], [[0, 1]]],
      filterTabs: [
        { title: 'a', fields: ['x', 'z'] },
        { title: 'b', fields: ['y'] },
      ],
      tabIndex,
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
        y: { lowerBound: 0, upperBound: 1 },
        z: { selectedValues: ['baz'] },
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
        x: { selectedValues: ['foo', 'bar'] },
        z: { selectedValues: ['baz'] },
      },
    };
    expect(cleared).toEqual(expected);
  });
});

describe('Remove empty filter in filter results', () => {
  test('Single empty filter', () => {
    const removed = removeEmptyFilter({
      x: { selectedValues: ['foo', 'bar'] },
      y: {},
      z: { __combineMode: 'AND' },
    });
    const expected = {
      x: { selectedValues: ['foo', 'bar'] },
      z: { __combineMode: 'AND' },
    };
    expect(removed).toEqual(expected);
  });
  test('Multiple empty filters', () => {
    const removed = removeEmptyFilter({
      x: {},
      y: { lowerBound: 0, upperBound: 1 },
      z: {},
    });
    const expected = {
      y: { lowerBound: 0, upperBound: 1 },
    };
    expect(removed).toEqual(expected);
  });
  test('Single empty filter with anchor', () => {
    const removed = removeEmptyFilter({
      'a:a0': {
        filter: {
          x: {},
          y: { lowerBound: 0, upperBound: 1 },
          z: { __combineMode: 'AND' },
        },
      },
    });
    const expected = {
      'a:a0': {
        filter: {
          y: { lowerBound: 0, upperBound: 1 },
          z: { __combineMode: 'AND' },
        },
      },
    };
    expect(removed).toEqual(expected);
  });
  test('Empty filters only with anchor', () => {
    const removed = removeEmptyFilter({
      'a:a0': {
        filter: {
          x: {},
          y: {},
        },
      },
    });
    const expected = {};
    expect(removed).toEqual(expected);
  });
  test('Empty filters with and without anchor', () => {
    const removed = removeEmptyFilter({
      x: { selectedValues: ['foo', 'bar'] },
      y: {},
      'a:a0': {
        filter: {
          x: {},
          y: { lowerBound: 0, upperBound: 1 },
        },
      },
    });
    const expected = {
      x: { selectedValues: ['foo', 'bar'] },
      'a:a0': {
        filter: {
          y: { lowerBound: 0, upperBound: 1 },
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
});

describe('Toggles combine mode in option filter', () => {
  function helper({ filterStatus, filterResults, combineModeValue }) {
    return toggleCombineOption({
      filterStatus,
      filterResults,
      filterTabs: [{ title: 'a', fields: ['x'] }],
      tabIndex: 0,
      sectionIndex: 0,
      combineModeFieldName: '__combineMode',
      combineModeValue,
    });
  }
  test('Missing combine mode', () => {
    const updated = helper({
      filterStatus: [[{ foo: true }]],
      filterResults: { x: { selectedValues: ['foo'] } },
      combineModeValue: 'OR',
    });
    const expected = {
      filterResults: { x: { selectedValues: ['foo'], __combineMode: 'OR' } },
      filterStatus: [[{ foo: true, __combineMode: 'OR' }]],
    };
    expect(updated).toEqual(expected);
  });
  test('Existing combine mode', () => {
    const updated = helper({
      filterStatus: [[{ foo: true, __combineMode: 'OR' }]],
      filterResults: { x: { selectedValues: ['foo'], __combineMode: 'OR' } },
      combineModeValue: 'AND',
    });
    const expected = {
      filterResults: { x: { selectedValues: ['foo'], __combineMode: 'AND' } },
      filterStatus: [[{ foo: true, __combineMode: 'AND' }]],
    };
    expect(updated).toEqual(expected);
  });
});

describe('Update a range filter', () => {
  const [minValue, maxValue] = [0, 5];
  function helper({ lowerBound, upperBound }) {
    return updateRangeValue({
      filterStatus: [[[0, 1]]],
      filterResults: { x: { lowerBound: 0, upperBound: 1 } },
      filterTabs: [{ title: 'a', fields: ['x'] }],
      tabIndex: 0,
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
      filterResults: { x: { lowerBound: 1, upperBound: 2 } },
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
      filterResults: {},
      filterStatus: [[[minValue, maxValue]]],
    };
    expect(updated).toEqual(expected);
  });
});

describe('Update an option filter', () => {
  function helper({ filterStatus, filterResults, selectedValue }) {
    return updateSelectedValue({
      filterStatus,
      filterResults,
      filterTabs: [{ title: 'a', fields: ['x'] }],
      tabIndex: 0,
      sectionIndex: 0,
      selectedValue,
    });
  }
  test('Select value', () => {
    const updated = helper({
      filterStatus: [[{}]],
      filterResults: {},
      selectedValue: 'foo',
    });
    const expected = {
      filterResults: { x: { selectedValues: ['foo'] } },
      filterStatus: [[{ foo: true }]],
    };
    expect(updated).toEqual(expected);
  });
  test('Unselect value', () => {
    const updated = helper({
      filterStatus: [[{ foo: true }]],
      filterResults: { x: { selectedValues: ['foo'] } },
      selectedValue: 'foo',
    });
    const expected = {
      filterResults: {},
      filterStatus: [[{ foo: false }]],
    };
    expect(updated).toEqual(expected);
  });
});
