import { FILTER_TYPE } from '../../GuppyComponents/Utils/const';
import {
  createFilterInfo,
  dereferenceFilter,
  isSurvivalAnalysisEnabled,
  polyfillFilter,
  polyfillFilterValue,
  updateFilterRefs,
} from './utils';

test('creates filter info object', () => {
  const filterConfig = {
    anchor: { field: 'anchor_field', options: [], tabs: [] },
    tabs: [
      { title: 'a', fields: ['foo_foo', 'foo_bar'] },
      { title: 'b', fields: ['bar.baz'] },
    ],
  };
  const fieldMapping = [
    { field: 'foo_bar', name: 'Customized Name' },
    { field: 'bar.baz', tooltip: 'lorem ipsum' },
  ];
  const expected = {
    anchor_field: { label: 'Anchor Field' },
    foo_foo: { label: 'Foo Foo' },
    foo_bar: { label: 'Customized Name' },
    'bar.baz': { label: 'Bar Baz', tooltip: 'lorem ipsum' },
  };
  expect(createFilterInfo(filterConfig, fieldMapping)).toEqual(expected);
});

test('checks whether survival analysis is enabled', () => {
  // not enabled
  let falsyConfig;
  expect(isSurvivalAnalysisEnabled(falsyConfig)).toBe(false);
  falsyConfig = {};
  expect(isSurvivalAnalysisEnabled(falsyConfig)).toBe(false);
  falsyConfig = { result: {} };
  expect(isSurvivalAnalysisEnabled(falsyConfig)).toBe(false);
  falsyConfig = { result: { survival: false } };
  expect(isSurvivalAnalysisEnabled(falsyConfig)).toBe(false);
  falsyConfig = { result: { risktable: false } };
  expect(isSurvivalAnalysisEnabled(falsyConfig)).toBe(false);
  falsyConfig = { result: { survival: false, risktable: false } };
  expect(isSurvivalAnalysisEnabled(falsyConfig)).toBe(false);

  // enabled
  let truthyConfig;
  truthyConfig = { result: { survival: true } };
  expect(isSurvivalAnalysisEnabled(truthyConfig)).toBe(true);
  truthyConfig = { result: { risktable: true } };
  expect(isSurvivalAnalysisEnabled(truthyConfig)).toBe(true);
  truthyConfig = { result: { survival: true, risktable: false } };
  expect(isSurvivalAnalysisEnabled(truthyConfig)).toBe(true);
  truthyConfig = { result: { survival: false, risktable: true } };
  expect(isSurvivalAnalysisEnabled(truthyConfig)).toBe(true);
  truthyConfig = { result: { survival: true, risktable: true } };
  expect(isSurvivalAnalysisEnabled(truthyConfig)).toBe(true);
});

describe('polyfill legacy filter value', () => {
  const option = { selectedValues: [] };
  const range = { lowerBound: 0, upperBound: 1 };

  test('single option filter', () => {
    const value = { foo: option };
    expect(polyfillFilterValue(value)).toStrictEqual({
      foo: { __type: FILTER_TYPE.OPTION, ...option },
    });
  });
  test('single range filter', () => {
    const value = { foo: range };
    expect(polyfillFilterValue(value)).toStrictEqual({
      foo: { __type: FILTER_TYPE.RANGE, ...range },
    });
  });
  test('single anchored filter', () => {
    const value = { 'foo:bar': { filter: { foo: option } } };
    expect(polyfillFilterValue(value)).toStrictEqual({
      'foo:bar': {
        __type: FILTER_TYPE.ANCHORED,
        value: { foo: { __type: FILTER_TYPE.OPTION, ...option } },
      },
    });
  });
  test('multiple filters', () => {
    const value = {
      foo: option,
      bar: range,
      'foo:bar': { filter: { foo: option, bar: range } },
    };
    expect(polyfillFilterValue(value)).toStrictEqual({
      foo: { __type: FILTER_TYPE.OPTION, ...option },
      bar: { __type: FILTER_TYPE.RANGE, ...range },
      'foo:bar': {
        __type: FILTER_TYPE.ANCHORED,
        value: {
          foo: { __type: FILTER_TYPE.OPTION, ...option },
          bar: { __type: FILTER_TYPE.RANGE, ...range },
        },
      },
    });
  });
});

describe('polyfill legacy filter', () => {
  const option = { selectedValues: [] };
  const range = { lowerBound: 0, upperBound: 1 };

  test('valid: no polyfill', () => {
    const value = {
      __combineMode: 'AND',
      __type: FILTER_TYPE.STANDARD,
      value: {},
    };
    expect(polyfillFilter(value)).toStrictEqual(value);
  });
  test('no __combindMode: no polyfill', () => {
    const value = {
      __type: FILTER_TYPE.STANDARD,
      value: {},
    };
    expect(polyfillFilter(value)).toStrictEqual({
      __combineMode: 'AND',
      ...value,
    });
  });
  test('no __type: no polyfill', () => {
    const value = {
      __combineMode: 'OR',
      value: {},
    };
    expect(polyfillFilter(value)).toStrictEqual({
      __type: FILTER_TYPE.STANDARD,
      ...value,
    });
  });
  test('polyfill empty', () => {
    const value = {};
    expect(polyfillFilter(value)).toStrictEqual({
      __combineMode: 'AND',
      __type: FILTER_TYPE.STANDARD,
      value: {},
    });
  });
  test('polyfill non-empty', () => {
    const value = { foo: option, bar: range };
    expect(polyfillFilter(value)).toStrictEqual({
      __combineMode: 'AND',
      __type: FILTER_TYPE.STANDARD,
      value: {
        foo: { __type: FILTER_TYPE.OPTION, ...option },
        bar: { __type: FILTER_TYPE.RANGE, ...range },
      },
    });
  });
});

describe('derefernece filter', () => {
  const __combineMode = /** @type {'AND'} */ ('AND');
  const refFilter = {
    __type: /** @type {'REF'} */ ('REF'),
    value: { id: 'x', label: '' },
  };
  const standardFilter = {
    __combineMode,
    __type: FILTER_TYPE.STANDARD,
    value: { foo: { __type: FILTER_TYPE.OPTION, selectedValues: [''] } },
  };

  /** @type {import('./types').ExplorerWorkspace} */
  const workspace = {
    activeId: '',
    all: {
      x: { filter: standardFilter },
      y: {
        filter: {
          __combineMode,
          __type: FILTER_TYPE.COMPOSED,
          value: [standardFilter],
        },
      },
      z: {
        filter: {
          __combineMode,
          __type: FILTER_TYPE.COMPOSED,
          value: [standardFilter, refFilter],
        },
      },
    },
  };
  test('standard', () => {
    const { filter } = workspace.all.x;
    expect(dereferenceFilter(filter, workspace)).toStrictEqual(filter);
  });
  test('composed, without ref', () => {
    const { filter } = workspace.all.y;
    expect(dereferenceFilter(filter, workspace)).toStrictEqual(filter);
  });
  test('composed, with ref', () => {
    const { filter } = workspace.all.z;
    expect(dereferenceFilter(filter, workspace)).toStrictEqual({
      __combineMode,
      __type: FILTER_TYPE.COMPOSED,
      value: [workspace.all[refFilter.value.id].filter, standardFilter],
    });
  });
  test('composed, with nested ref', () => {
    const filter = {
      __combineMode,
      __type: FILTER_TYPE.COMPOSED,
      value: [refFilter, standardFilter, workspace.all.z.filter],
    };
    expect(dereferenceFilter(filter, workspace)).toStrictEqual({
      __combineMode,
      __type: FILTER_TYPE.COMPOSED,
      value: [
        workspace.all[refFilter.value.id].filter,
        standardFilter,
        {
          __combineMode,
          __type: FILTER_TYPE.COMPOSED,
          value: [workspace.all[refFilter.value.id].filter, standardFilter],
        },
      ],
    });
  });
});

describe('update filter references after a filter set removed', () => {
  const __combineMode = /** @type {'AND'} */ ('AND');
  const standardFilter = {
    __type: FILTER_TYPE.STANDARD,
    __combineMode,
    value: {},
  };
  test('no referenced filter', () => {
    const workspace = /** @type {import('./types').ExplorerWorkspace} */ ({
      activeId: '',
      all: {
        foo: { name: 'foo', description: '', filter: standardFilter },
        bar: { filter: standardFilter },
      },
    });

    delete workspace.all.foo;
    updateFilterRefs(workspace);

    expect(workspace).toStrictEqual({
      activeId: '',
      all: { bar: { filter: standardFilter } },
    });
  });
  test('non-referenced filter removed', () => {
    const workspace = /** @type {import('./types').ExplorerWorkspace} */ ({
      activeId: '',
      all: {
        foo: { name: 'foo', description: '', filter: standardFilter },
        bar: { filter: standardFilter },
        baz: {
          filter: {
            __type: FILTER_TYPE.COMPOSED,
            __combineMode,
            refIds: ['bar'],
            value: [{ __type: 'REF', value: { id: 'bar', label: '#2' } }],
          },
        },
      },
    });

    delete workspace.all.foo;
    updateFilterRefs(workspace);

    expect(workspace).toStrictEqual({
      activeId: '',
      all: {
        bar: { filter: standardFilter },
        baz: {
          filter: {
            __type: FILTER_TYPE.COMPOSED,
            __combineMode,
            refIds: ['bar'],
            value: [{ __type: 'REF', value: { id: 'bar', label: '#1' } }],
          },
        },
      },
    });
  });
  test('referenced local filter removed', () => {
    const workspace = /** @type {import('./types').ExplorerWorkspace} */ ({
      activeId: '',
      all: {
        foo: { name: 'foo', description: '', filter: standardFilter },
        bar: { filter: standardFilter },
        baz: {
          filter: {
            __type: FILTER_TYPE.COMPOSED,
            __combineMode,
            refIds: ['foo', 'bar'],
            value: [
              { __type: 'REF', value: { id: 'foo', label: 'foo' } },
              { __type: 'REF', value: { id: 'bar', label: '#2' } },
            ],
          },
        },
      },
    });

    delete workspace.all.bar;
    updateFilterRefs(workspace);

    expect(workspace).toStrictEqual({
      activeId: '',
      all: {
        foo: { name: 'foo', description: '', filter: standardFilter },
        baz: {
          filter: {
            __type: FILTER_TYPE.COMPOSED,
            __combineMode,
            refIds: ['foo'],
            value: [{ __type: 'REF', value: { id: 'foo', label: 'foo' } }],
          },
        },
      },
    });
  });
  test('referenced saved filter removed', () => {
    const workspace = /** @type {import('./types').ExplorerWorkspace} */ ({
      activeId: '',
      all: {
        foo: { name: 'foo', description: '', filter: standardFilter },
        bar: { filter: standardFilter },
        baz: {
          filter: {
            __type: FILTER_TYPE.COMPOSED,
            __combineMode,
            refIds: ['foo', 'bar'],
            value: [
              { __type: 'REF', value: { id: 'foo', label: 'foo' } },
              { __type: 'REF', value: { id: 'bar', label: '#2' } },
            ],
          },
        },
      },
    });

    delete workspace.all.foo;
    updateFilterRefs(workspace);

    expect(workspace).toStrictEqual({
      activeId: '',
      all: {
        bar: { filter: standardFilter },
        baz: {
          filter: {
            __type: FILTER_TYPE.COMPOSED,
            __combineMode,
            refIds: ['bar'],
            value: [{ __type: 'REF', value: { id: 'bar', label: '#1' } }],
          },
        },
      },
    });
  });
});
