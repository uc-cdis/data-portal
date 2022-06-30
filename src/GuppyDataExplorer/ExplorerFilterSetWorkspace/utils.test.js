import {
  pluckFromFilter,
  pluckFromAnchorFilter,
  workspaceReducer,
  createEmptyWorkspaceFilterSet,
} from './utils';

/** @typedef {import('./types').FilterSetWorkspaceState} FilterSetWorkspaceState */

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

describe('workspaceReducer', () => {
  const EMPTY_FILTER_SET = createEmptyWorkspaceFilterSet();
  const SIMPLE_FILTER_SET = { filter: { x: {}, y: {} } };
  const SIMPLE_SAVED_FILTER_SET = {
    ...SIMPLE_FILTER_SET,
    explorerId: 0,
    description: 'ipsum',
    id: 0,
    name: 'lorem',
  };

  test('clear', () => {
    const initialState = /** @type {FilterSetWorkspaceState} */ ({
      active: { filterSet: SIMPLE_FILTER_SET, id: 'foo' },
      all: { foo: SIMPLE_FILTER_SET },
    });
    const action =
      /** @type {import('./types').FilterSetWorkspaceClearAction} */ ({
        type: 'CLEAR',
      });
    const newState = workspaceReducer(initialState, action);
    const expected = {
      ...initialState,
      active: { ...initialState.active, filterSet: EMPTY_FILTER_SET },
      all: {
        ...initialState.all,
        [initialState.active.id]: EMPTY_FILTER_SET,
      },
    };
    expect(newState).toStrictEqual(expected);
  });
  test('clear all', () => {
    const initialState = /** @type {FilterSetWorkspaceState} */ ({
      active: { filterSet: EMPTY_FILTER_SET, id: 'foo' },
      all: { foo: EMPTY_FILTER_SET },
    });
    const action =
      /** @type {import('./types').FilterSetWorkspaceClearAllAction} */ ({
        type: 'CLEAR-ALL',
        payload: { newId: 'bar' },
      });
    const newState = workspaceReducer(initialState, action);
    const expected = {
      active: { filterSet: EMPTY_FILTER_SET, id: action.payload.newId },
      all: {
        [action.payload.newId]: EMPTY_FILTER_SET,
      },
    };
    expect(newState).toStrictEqual(expected);
  });
  test('create', () => {
    const initialState = /** @type {FilterSetWorkspaceState} */ ({
      active: { filterSet: SIMPLE_FILTER_SET, id: 'foo' },
      all: { foo: SIMPLE_FILTER_SET },
    });
    const action =
      /** @type {import('./types').FilterSetWorkspaceCreateAction} */ ({
        type: 'CREATE',
        payload: { newId: 'bar' },
      });
    const newState = workspaceReducer(initialState, action);
    const expected = {
      active: { filterSet: EMPTY_FILTER_SET, id: action.payload.newId },
      all: {
        ...initialState.all,
        [action.payload.newId]: EMPTY_FILTER_SET,
      },
    };
    expect(newState).toStrictEqual(expected);
  });
  test('duplicate', () => {
    const initialState = /** @type {FilterSetWorkspaceState} */ ({
      active: { filterSet: SIMPLE_SAVED_FILTER_SET, id: 'foo' },
      all: { foo: SIMPLE_SAVED_FILTER_SET },
    });
    const action =
      /** @type {import('./types').FilterSetWorkspaceDuplicateAction} */ ({
        type: 'DUPLICATE',
        payload: { newId: 'bar' },
      });
    const newState = workspaceReducer(initialState, action);
    const expected = {
      active: { filterSet: SIMPLE_FILTER_SET, id: action.payload.newId },
      all: {
        ...initialState.all,
        [action.payload.newId]: SIMPLE_FILTER_SET,
      },
    };
    expect(newState).toStrictEqual(expected);
  });
  test('load', () => {
    const initialState = /** @type {FilterSetWorkspaceState} */ ({
      active: { filterSet: EMPTY_FILTER_SET, id: 'foo' },
      all: { foo: EMPTY_FILTER_SET },
    });
    const action =
      /** @type {import('./types').FilterSetWorkspaceLoadAction} */ ({
        type: 'LOAD',
        payload: { filterSet: SIMPLE_SAVED_FILTER_SET, newId: 'bar' },
      });
    const newState = workspaceReducer(initialState, action);
    const expected = {
      active: { filterSet: action.payload.filterSet, id: action.payload.newId },
      all: {
        ...initialState.all,
        [action.payload.newId]: action.payload.filterSet,
      },
    };
    expect(newState).toStrictEqual(expected);
  });
  test('load: overwrite', () => {
    const initialState = /** @type {FilterSetWorkspaceState} */ ({
      active: { filterSet: EMPTY_FILTER_SET, id: 'foo' },
      all: { foo: EMPTY_FILTER_SET },
    });
    const action =
      /** @type {import('./types').FilterSetWorkspaceLoadAction} */ ({
        type: 'LOAD',
        payload: { filterSet: SIMPLE_SAVED_FILTER_SET },
      });
    const newState = workspaceReducer(initialState, action);
    const expected = {
      ...initialState,
      active: { ...initialState.active, filterSet: action.payload.filterSet },
      all: {
        ...initialState.all,
        [initialState.active.id]: action.payload.filterSet,
      },
    };
    expect(newState).toStrictEqual(expected);
  });
  test('remove', () => {
    const initialState = /** @type {FilterSetWorkspaceState} */ ({
      active: { filterSet: SIMPLE_FILTER_SET, id: 'foo' },
      all: { foo: SIMPLE_FILTER_SET, bar: SIMPLE_FILTER_SET },
    });
    const action =
      /** @type {import('./types').FilterSetWorkspaceRemoveAction} */ ({
        type: 'REMOVE',
        payload: { newId: 'baz' },
      });
    const newState = workspaceReducer(initialState, action);
    const expected = {
      active: { id: 'bar', filterSet: initialState.all.bar },
      all: {
        bar: initialState.all.bar,
      },
    };
    expect(newState).toStrictEqual(expected);
  });
  test('remove: last', () => {
    const initialState = /** @type {FilterSetWorkspaceState} */ ({
      active: { filterSet: SIMPLE_FILTER_SET, id: 'foo' },
      all: { foo: SIMPLE_FILTER_SET },
    });
    const action =
      /** @type {import('./types').FilterSetWorkspaceRemoveAction} */ ({
        type: 'REMOVE',
        payload: { newId: 'bar' },
      });
    const newState = workspaceReducer(initialState, action);
    const expected = {
      active: { filterSet: EMPTY_FILTER_SET, id: action.payload.newId },
      all: {
        [action.payload.newId]: EMPTY_FILTER_SET,
      },
    };
    expect(newState).toStrictEqual(expected);
  });
  test('save', () => {
    const initialState = /** @type {FilterSetWorkspaceState} */ ({
      active: { filterSet: EMPTY_FILTER_SET, id: 'foo' },
      all: { foo: EMPTY_FILTER_SET },
    });
    const action =
      /** @type {import('./types').FilterSetWorkspaceSaveAction} */ ({
        type: 'SAVE',
        payload: { filterSet: SIMPLE_SAVED_FILTER_SET },
      });
    const newState = workspaceReducer(initialState, action);
    const expected = {
      ...initialState,
      active: { ...initialState.active, filterSet: action.payload.filterSet },
      all: {
        ...initialState.all,
        [initialState.active.id]: action.payload.filterSet,
      },
    };
    expect(newState).toStrictEqual(expected);
  });
  test('update', () => {
    const initialState = /** @type {FilterSetWorkspaceState} */ ({
      active: { filterSet: SIMPLE_FILTER_SET, id: 'foo' },
      all: { foo: SIMPLE_FILTER_SET },
    });
    const action =
      /** @type {import('./types').FilterSetWorkspaceUpdateAction} */ ({
        type: 'UPDATE',
        payload: { filter: { z: {} } },
      });
    const newState = workspaceReducer(initialState, action);
    const expected = {
      ...initialState,
      active: {
        ...initialState.active,
        filterSet: {
          ...initialState.active.filterSet,
          filter: action.payload.filter,
        },
      },
      all: {
        ...initialState.all,
        [initialState.active.id]: {
          ...initialState.all[initialState.active.id],
          filter: action.payload.filter,
        },
      },
    };
    expect(newState).toStrictEqual(expected);
  });
  test('use', () => {
    const initialState = /** @type {FilterSetWorkspaceState} */ ({
      active: { filterSet: EMPTY_FILTER_SET, id: 'foo' },
      all: { foo: EMPTY_FILTER_SET, bar: EMPTY_FILTER_SET },
    });
    const action =
      /** @type {import('./types').FilterSetWorkspaceUseAction} */ ({
        type: 'USE',
        payload: { id: 'bar' },
      });
    const newState = workspaceReducer(initialState, action);
    const expected = {
      ...initialState,
      active: {
        filterSet: initialState.all[action.payload.id],
        id: action.payload.id,
      },
    };
    expect(newState).toStrictEqual(expected);
  });
});
