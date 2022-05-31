import { useEffect, useMemo, useReducer } from 'react';
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
      payload.callback?.(active);

      const all = { ...state.all, [id]: filterSet };
      const size = Object.keys(all).length;
      return { active, all, size };
    }
    case 'CLEAR-ALL': {
      const { id } = payload;
      const filterSet = createEmptyWorkspaceFilterSet();

      const active = { filterSet, id };
      payload.callback?.(active);

      const all = { [id]: filterSet };
      const size = Object.keys(all).length;
      return { active, all, size };
    }
    case 'CREATE': {
      const { id } = payload;
      const filterSet = createEmptyWorkspaceFilterSet();

      const active = { filterSet, id };
      payload.callback?.(active);

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
      payload.callback?.(active);

      const all = { ...newState.all, [id]: filterSet };
      const size = Object.keys(all).length;
      return { active, all, size };
    }
    case 'LOAD': {
      const id = payload.id ?? state.active.id;
      const filterSet = cloneDeep(payload.filterSet);

      const active = { filterSet, id };
      payload.callback?.(active);

      const all = { ...state.all, [id]: filterSet };
      const size = Object.keys(all).length;
      return { active, all, size };
    }
    case 'SAVE': {
      const { id } = state.active;
      const { filterSet } = payload;

      const active = { filterSet, id };
      payload.callback?.(active);

      const all = { ...state.all, [id]: filterSet };
      const size = Object.keys(all).length;
      return { active, all, size };
    }
    case 'DUPLICATE': {
      const { id } = state.active;
      const { newId } = payload;
      const filterSet = { filter: cloneDeep(state.all[id].filter) };

      const active = { filterSet, id: newId };
      payload.callback?.(active);

      const all = { ...state.all, [newId]: filterSet };
      const size = Object.keys(all).length;
      return { active, all, size };
    }
    case 'UPDATE': {
      const { id } = state.active;
      const { filter: newFilter } = payload;
      const filterSet = { ...state.all[id], filter: cloneDeep(newFilter) };

      const active = { filterSet, id };
      payload.callback?.(active);

      const all = { ...state.all, [id]: filterSet };
      const size = Object.keys(all).length;
      return { active, all, size };
    }
    case 'USE': {
      const { id } = payload;
      const filterSet = state.all[id];

      const active = { filterSet, id };
      payload.callback?.(active);

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
  useEffect(() => storeWorkspaceState(wsState), [wsState]);

  /** @param {FilterSetWorkspaceMethodCallback} [callback] */
  function clear(callback) {
    dispatch({
      type: 'CLEAR',
      payload: {
        callback(args) {
          callback?.(args.filterSet);
        },
      },
    });
  }
  /** @param {FilterSetWorkspaceMethodCallback} [callback] */
  function clearAll(callback) {
    dispatch({
      type: 'CLEAR-ALL',
      payload: {
        id: crypto.randomUUID(),
        callback(args) {
          callback?.(args.filterSet);
        },
      },
    });
  }
  /** @param {FilterSetWorkspaceMethodCallback} [callback] */
  function create(callback) {
    dispatch({
      type: 'CREATE',
      payload: {
        id: crypto.randomUUID(),
        callback(args) {
          callback?.(args.filterSet);
        },
      },
    });
  }
  /** @param {FilterSetWorkspaceMethodCallback} [callback] */
  function duplicate(callback) {
    dispatch({
      type: 'DUPLICATE',
      payload: {
        newId: crypto.randomUUID(),
        callback(args) {
          callback?.(args.filterSet);
        },
      },
    });
  }

  /**
   * @param {ExplorerFilterSet} filterSet
   * @param {boolean} [shouldOverwrite]
   * @param {FilterSetWorkspaceMethodCallback} [callback]
   */
  function load(filterSet, shouldOverwrite, callback) {
    dispatch({
      type: 'LOAD',
      payload: {
        id: shouldOverwrite ? undefined : crypto.randomUUID(),
        filterSet,
        callback(args) {
          callback?.(args.filterSet);
        },
      },
    });
  }

  /**
   * @param {ExplorerFilterSet} filterSet
   * @param {FilterSetWorkspaceMethodCallback} [callback]
   */
  function save(filterSet, callback) {
    dispatch({
      type: 'SAVE',
      payload: {
        filterSet,
        callback(args) {
          callback?.(args.filterSet);
        },
      },
    });
  }

  /** @param {FilterSetWorkspaceMethodCallback} [callback] */
  function remove(callback) {
    dispatch({
      type: 'REMOVE',
      payload: {
        newId: crypto.randomUUID(),
        callback(args) {
          callback?.(args.filterSet);
        },
      },
    });
  }

  /**
   * @param {ExplorerFilter} newFilter
   * @param {FilterSetWorkspaceMethodCallback} [callback]
   */
  function update(newFilter, callback) {
    dispatch({
      type: 'UPDATE',
      payload: {
        filter: newFilter,
        callback(args) {
          callback?.(args.filterSet);
        },
      },
    });
  }
  useEffect(() => update(explorerFilter), [explorerFilter]);

  /**
   * @param {string} newId
   * @param {FilterSetWorkspaceMethodCallback} [callback]
   */
  function use(newId, callback) {
    dispatch({
      type: 'USE',
      payload: {
        id: newId,
        callback(args) {
          callback?.(args.filterSet);
        },
      },
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
