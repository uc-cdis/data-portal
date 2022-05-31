import { useEffect, useMemo, useReducer, useRef } from 'react';
import cloneDeep from 'lodash.clonedeep';
import { useExplorerState } from '../ExplorerStateContext';
import {
  checkIfFilterEmpty,
  createEmptyWorkspaceFilterSet,
  initializeWorkspaceState,
  storeWorkspaceState,
} from './utils';

/** @typedef {import("../types").ExplorerFilter} ExplorerFilter */
/** @typedef {import("../types").ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('./types').FilterSetWorkspaceState} FilterSetWorkspaceState */
/** @typedef {import('./types').FilterSetWorkspaceAction} FilterSetWorkspaceAction */
/** @typedef {import('./types').UnsavedExplorerFilterSet} UnsavedExplorerFilterSet */

/**
 * @callback FilterSetWorkspaceMethodCallback
 * @param {ExplorerFilterSet | UnsavedExplorerFilterSet} filterSet
 * @returns {void}
 */

/**
 * @param {FilterSetWorkspaceState} state
 * @param {FilterSetWorkspaceAction} action
 * @returns {FilterSetWorkspaceState}
 */
function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case 'CLEAR': {
      const { id } = state.active;
      const filterSet = createEmptyWorkspaceFilterSet();

      const active = { filterSet, id };
      const all = { ...state.all, [id]: filterSet };
      const size = Object.keys(all).length;
      return { active, all, size };
    }
    case 'CLEAR-ALL': {
      const { id } = payload;
      const filterSet = createEmptyWorkspaceFilterSet();

      const active = { filterSet, id };
      const all = { [id]: filterSet };
      const size = Object.keys(all).length;
      return { active, all, size };
    }
    case 'CREATE': {
      const { id } = payload;
      const filterSet = createEmptyWorkspaceFilterSet();

      const active = { filterSet, id };
      const all = { ...state.all, [id]: filterSet };
      const size = Object.keys(all).length;
      return { active, all, size };
    }
    case 'REMOVE': {
      const newState = cloneDeep(state);
      delete newState.all[state.active.id];

      const [firstEntry] = Object.entries(newState.all);
      const [id, filterSet] = firstEntry ?? [
        payload.newId,
        createEmptyWorkspaceFilterSet(),
      ];

      const active = { filterSet, id };
      const all = { ...newState.all, [id]: filterSet };
      const size = Object.keys(all).length;
      return { active, all, size };
    }
    case 'LOAD': {
      const id = payload.id ?? state.active.id;
      const filterSet = cloneDeep(payload.filterSet);

      const active = { filterSet, id };
      const all = { ...state.all, [id]: filterSet };
      const size = Object.keys(all).length;
      return { active, all, size };
    }
    case 'SAVE': {
      const { id } = state.active;
      const { filterSet } = payload;

      const active = { filterSet, id };
      const all = { ...state.all, [id]: filterSet };
      const size = Object.keys(all).length;
      return { active, all, size };
    }
    case 'DUPLICATE': {
      const { id } = state.active;
      const { newId } = payload;
      const filterSet = { filter: cloneDeep(state.all[id].filter) };

      const active = { filterSet, id: newId };
      const all = { ...state.all, [newId]: filterSet };
      const size = Object.keys(all).length;
      return { active, all, size };
    }
    case 'UPDATE': {
      const { id } = state.active;
      const { filter: newFilter } = payload;
      const filterSet = { ...state.all[id], filter: cloneDeep(newFilter) };

      const active = { filterSet, id };
      const all = { ...state.all, [id]: filterSet };
      const size = Object.keys(all).length;
      return { active, all, size };
    }
    case 'USE': {
      const { id } = payload;
      const filterSet = state.all[id];

      const active = { filterSet, id };
      return { ...state, active };
    }
    default:
      return state;
  }
}

export default function useFilterSetWorkspace() {
  const { explorerFilter, handleFilterChange } = useExplorerState();
  const initialWsState = useMemo(
    () => initializeWorkspaceState(explorerFilter),
    []
  );
  useEffect(() => {
    // sync filter UI with non-empty initial workspace filter
    if (!checkIfFilterEmpty(initialWsState.active.filterSet.filter))
      handleFilterChange(initialWsState.active.filterSet.filter);
  }, []);
  const [wsState, dispatch] = useReducer(reducer, initialWsState);
  const prevActiveFilter = useRef(wsState.active.filterSet.filter);
  useEffect(() => {
    storeWorkspaceState(wsState);

    const { filter } = wsState.active.filterSet;
    const isActiveFilterChanged =
      JSON.stringify(prevActiveFilter.current) !== JSON.stringify(filter);
    if (isActiveFilterChanged) {
      prevActiveFilter.current = filter;
      handleFilterChange(filter);
    }
  }, [wsState]);

  function clear() {
    dispatch({
      type: 'CLEAR',
      payload: undefined,
    });
  }
  function clearAll() {
    dispatch({
      type: 'CLEAR-ALL',
      payload: { id: crypto.randomUUID() },
    });
  }
  function create() {
    dispatch({
      type: 'CREATE',
      payload: { id: crypto.randomUUID() },
    });
  }
  function duplicate() {
    dispatch({
      type: 'DUPLICATE',
      payload: { newId: crypto.randomUUID() },
    });
  }

  /**
   * @param {ExplorerFilterSet} filterSet
   * @param {boolean} [shouldOverwrite]
   */
  function load(filterSet, shouldOverwrite) {
    dispatch({
      type: 'LOAD',
      payload: {
        id: shouldOverwrite ? undefined : crypto.randomUUID(),
        filterSet,
      },
    });
  }

  /**
   * @param {ExplorerFilterSet} filterSet
   */
  function save(filterSet) {
    dispatch({
      type: 'SAVE',
      payload: { filterSet },
    });
  }

  function remove() {
    dispatch({
      type: 'REMOVE',
      payload: { newId: crypto.randomUUID() },
    });
  }

  /**
   * @param {ExplorerFilter} newFilter
   */
  function update(newFilter) {
    dispatch({
      type: 'UPDATE',
      payload: { filter: newFilter },
    });
  }
  useEffect(() => update(explorerFilter), [explorerFilter]);

  /**
   * @param {string} newId
   */
  function use(newId) {
    dispatch({
      type: 'USE',
      payload: { id: newId },
    });
  }

  return useMemo(
    () => ({
      ...wsState,
      clear,
      clearAll,
      create,
      duplicate,
      load,
      save,
      remove,
      update,
      use,
    }),
    [wsState]
  );
}
