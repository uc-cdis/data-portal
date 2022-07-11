import { useEffect, useMemo, useReducer, useRef } from 'react';
import { updateExplorerFilter } from '../../redux/explorer/slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useExplorerFilterSets } from '../ExplorerFilterSetsContext';
import {
  checkIfFilterEmpty,
  initializeWorkspaceState,
  storeWorkspaceState,
  workspaceReducer,
} from './utils';

/** @typedef {import("../types").ExplorerFilter} ExplorerFilter */
/** @typedef {import("../types").ExplorerFilterSet} ExplorerFilterSet */

export default function useFilterSetWorkspace() {
  const appDispatch = useAppDispatch();
  function handleFilterChange(filter) {
    appDispatch(updateExplorerFilter(filter));
  }
  const { explorerFilter, explorerId } = useAppSelector(
    (state) => state.explorer
  );
  const filterSets = useExplorerFilterSets();

  const initialState = useMemo(
    () => initializeWorkspaceState({ explorerFilter, explorerId }),
    []
  );
  useEffect(() => {
    const initialActiveFilterSet = initialState.active.filterSet;

    // sync explorer filter set state with initial workspace active filter set
    filterSets.use(initialActiveFilterSet.id);

    // sync explorer filter state with non-empty initial workspace active filter
    if (!checkIfFilterEmpty(initialActiveFilterSet.filter))
      handleFilterChange(initialActiveFilterSet.filter);
  }, []);

  const [state, dispatch] = useReducer(workspaceReducer, initialState);
  const prevActiveFilterSet = useRef(state.active.filterSet);
  useEffect(() => {
    const { filter: prevFilter, id: prevId } = prevActiveFilterSet.current;
    const { filter, id } = state.active.filterSet;
    prevActiveFilterSet.current = state.active.filterSet;

    // sync explorer filter state with workspace active filter
    const isFilterChanged =
      JSON.stringify(prevFilter) !== JSON.stringify(filter);
    if (isFilterChanged) handleFilterChange(filter);

    // sync explorer filter sets state with workspace active filter set
    const isFilterSetIdChanged = prevId !== id;
    if (isFilterSetIdChanged) filterSets.use(id);

    // sync browser store with workspace state
    storeWorkspaceState({ explorerId, state });
  }, [state]);

  const isInitialRender1 = useRef(true);
  useEffect(() => {
    // sync workspace active filter with explorer filter set state (skip initial render)
    if (isInitialRender1.current) isInitialRender1.current = false;
    else if (filterSets.active?.id !== undefined)
      dispatch({ type: 'LOAD', payload: { filterSet: filterSets.active } });
  }, [filterSets.active]);

  const isInitialRender2 = useRef(true);
  useEffect(() => {
    // sync workspace active filter with explorer filter state (skip initial render)
    if (isInitialRender2.current) isInitialRender2.current = false;
    else dispatch({ type: 'UPDATE', payload: { filter: explorerFilter } });
  }, [explorerFilter]);

  return useMemo(
    () => ({
      ...state,
      size: Object.keys(state.all).length,
      clear() {
        dispatch({ type: 'CLEAR' });
      },
      clearAll() {
        const newId = crypto.randomUUID();
        dispatch({ type: 'CLEAR-ALL', payload: { newId } });
      },
      create() {
        const newId = crypto.randomUUID();
        dispatch({ type: 'CREATE', payload: { newId } });
      },
      duplicate() {
        const newId = crypto.randomUUID();
        dispatch({ type: 'DUPLICATE', payload: { newId } });
      },
      /**
       * @param {ExplorerFilterSet} filterSet
       * @param {boolean} [shouldOverwrite]
       */
      load(filterSet, shouldOverwrite) {
        const newId = shouldOverwrite ? undefined : crypto.randomUUID();
        dispatch({ type: 'LOAD', payload: { newId, filterSet } });
      },
      remove() {
        const newId = crypto.randomUUID();
        dispatch({ type: 'REMOVE', payload: { newId } });
      },
      /** @param {ExplorerFilterSet} filterSet */
      save(filterSet) {
        dispatch({ type: 'SAVE', payload: { filterSet } });
      },
      /** @param {ExplorerFilter} filter */
      update(filter) {
        dispatch({ type: 'UPDATE', payload: { filter } });
      },
      /** @param {string} id */
      use(id) {
        dispatch({ type: 'USE', payload: { id } });
      },
    }),
    [state]
  );
}
