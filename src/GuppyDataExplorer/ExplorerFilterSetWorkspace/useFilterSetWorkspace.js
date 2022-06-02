import { useEffect, useMemo, useReducer, useRef } from 'react';
import { useExplorerFilterSets } from '../ExplorerFilterSetsContext';
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
  const filterSets = useExplorerFilterSets();
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
  const prevActiveFilterSet = useRef(state.active.filterSet);
  useEffect(() => {
    // sync with browser store
    storeWorkspaceState(state);

    const { filter: prevFilter, id: prevId } = prevActiveFilterSet.current;
    const { filter, id } = state.active.filterSet;

    // sync with explorer filter state
    const isFilterChanged =
      JSON.stringify(prevFilter) !== JSON.stringify(filter);
    if (isFilterChanged) handleFilterChange(filter);

    // sync with explorer filter sets state
    const isFilterSetIdChanged = prevId !== id;
    if (isFilterSetIdChanged) filterSets.use(id);

    if (isFilterChanged || isFilterSetIdChanged)
      prevActiveFilterSet.current = state.active.filterSet;
  }, [state]);

  function clear() {
    dispatch({
      type: 'CLEAR',
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
