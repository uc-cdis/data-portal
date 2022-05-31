import { useEffect, useMemo, useReducer, useState } from 'react';
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
      const { id } = payload;
      const filterSet = createEmptyWorkspaceFilterSet();

      payload.callback?.({ filterSet, id });

      return { all: { ...state.all, [id]: filterSet } };
    }
    case 'CLEAR-ALL': {
      const { id } = payload;
      const filterSet = createEmptyWorkspaceFilterSet();

      payload.callback?.({ filterSet, id });

      return { all: { [id]: filterSet } };
    }
    case 'CREATE': {
      const { id } = payload;
      const filterSet = createEmptyWorkspaceFilterSet();

      payload.callback?.({ filterSet, id });

      return { all: { ...state.all, [id]: filterSet } };
    }
    case 'REMOVE': {
      const newState = cloneDeep(state);
      delete newState.all[payload.id];

      const [firstEntry] = Object.entries(newState.all);
      const [id, filterSet] = firstEntry ?? [
        payload.newId,
        createEmptyWorkspaceFilterSet(),
      ];

      payload.callback?.({ filterSet, id });

      return { all: { ...newState.all, [id]: filterSet } };
    }
    case 'LOAD': {
      const { id } = payload;
      const filterSet = cloneDeep(payload.filterSet);

      payload.callback?.({ filterSet, id });

      return { all: { ...state.all, [id]: filterSet } };
    }
    case 'SAVE': {
      const { filterSet, id } = payload;

      payload.callback?.({ filterSet, id });

      return { all: { ...state.all, [id]: filterSet } };
    }
    case 'DUPLICATE': {
      const { newId } = payload;
      const filterSet = { filter: cloneDeep(state[payload.id].filter) };

      payload.callback?.({ filterSet, id: newId });

      return { all: { ...state.all, [newId]: filterSet } };
    }
    case 'UPDATE': {
      const { id, filter: newFilter } = payload;
      const filterSet = { ...state[id], filter: cloneDeep(newFilter) };

      payload.callback?.({ filterSet, id });

      return { all: { ...state.all, [id]: filterSet } };
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
    const values = Object.values(initialWsState.all);
    if (values.length > 1 || !checkIfFilterEmpty(values[0].filter))
      handleFilterChange(values[0].filter);
  }, []);
  const [id, setId] = useState(Object.keys(initialWsState.all)[0]);
  const [wsState, dispatch] = useReducer(reducer, initialWsState);
  useEffect(() => storeWorkspaceState(wsState), [wsState]);

  /** @param {FilterSetWorkspaceMethodCallback} [callback] */
  function clear(callback) {
    dispatch({
      type: 'CLEAR',
      payload: {
        id,
        callback(args) {
          setId(args.id);
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
          setId(args.id);
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
          setId(args.id);
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
        id,
        newId: crypto.randomUUID(),
        callback(args) {
          setId(args.id);
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
        id: shouldOverwrite ? id : crypto.randomUUID(),
        filterSet,
        callback(args) {
          setId(args.id);
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
        id,
        filterSet,
        callback(args) {
          setId(args.id);
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
        id,
        newId: crypto.randomUUID(),
        callback(args) {
          setId(args.id);
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
        id,
        filter: newFilter,
        callback(args) {
          setId(args.id);
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
    setId(newId);
    callback?.(wsState[newId]);
  }

  return useMemo(
    () => ({
      ...wsState,
      active: { id, filterSet: wsState.all[id] },
      size: Object.keys(wsState.all).length,
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
    [id, wsState]
  );
}
