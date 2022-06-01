import { useEffect, useMemo, useReducer, useRef } from 'react';
import { useExplorerState } from '../ExplorerStateContext';
import {
  checkIfFilterEmpty,
  initializeWorkspaceState,
  storeWorkspaceState,
  workspaceReducer,
} from './utils';

/** @typedef {import("../types").ExplorerFilter} ExplorerFilter */
/** @typedef {import("../types").ExplorerFilterSet} ExplorerFilterSet */

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
  const [state, dispatch] = useReducer(workspaceReducer, initialWsState);
  const prevActiveFilter = useRef(state.active.filterSet.filter);
  useEffect(() => {
    storeWorkspaceState(state);

    const { filter } = state.active.filterSet;
    const isActiveFilterChanged =
      JSON.stringify(prevActiveFilter.current) !== JSON.stringify(filter);
    if (isActiveFilterChanged) {
      prevActiveFilter.current = filter;
      handleFilterChange(filter);
    }
  }, [state]);

  function clear() {
    dispatch({
      type: 'CLEAR',
      payload: undefined,
    });
  }
  function clearAll() {
    dispatch({
      type: 'CLEAR-ALL',
      payload: { newId: crypto.randomUUID() },
    });
  }
  function create() {
    dispatch({
      type: 'CREATE',
      payload: { newId: crypto.randomUUID() },
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
        newId: shouldOverwrite ? undefined : crypto.randomUUID(),
        filterSet,
      },
    });
  }
  function remove() {
    dispatch({
      type: 'REMOVE',
      payload: { newId: crypto.randomUUID() },
    });
  }
  /** @param {ExplorerFilterSet} filterSet */
  function save(filterSet) {
    dispatch({
      type: 'SAVE',
      payload: { filterSet },
    });
  }
  /** @param {ExplorerFilter} filter */
  function update(filter) {
    dispatch({
      type: 'UPDATE',
      payload: { filter },
    });
  }
  useEffect(() => update(explorerFilter), [explorerFilter]);
  /** @param {string} id */
  function use(id) {
    dispatch({
      type: 'USE',
      payload: { id },
    });
  }

  return useMemo(
    () => ({
      ...state,
      size: Object.keys(state.all).length,
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
    [state]
  );
}
