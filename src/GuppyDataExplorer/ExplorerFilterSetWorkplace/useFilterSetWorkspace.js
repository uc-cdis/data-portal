import { useEffect, useMemo, useReducer, useState } from 'react';
import cloneDeep from 'lodash.clonedeep';
import { useExplorerState } from '../ExplorerStateContext';
import {
  checkIfFilterEmpty,
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
    case 'CREATE': {
      const id = crypto.randomUUID();
      /** @type {UnsavedExplorerFilterSet} */
      const filterSet = { filter: {} };

      payload.callback?.({ filterSet, id });

      return { ...state, [id]: filterSet };
    }
    case 'REMOVE': {
      const newState = cloneDeep(state);
      delete newState[payload.id];

      const [id, filterSet] = Object.entries(newState)[0];
      payload.callback?.({ filterSet, id });

      return newState;
    }
    case 'LOAD': {
      const id = payload.id ?? crypto.randomUUID();
      const filterSet = cloneDeep(payload.filterSet);

      payload.callback?.({ filterSet, id });

      return { ...state, [id]: filterSet };
    }
    case 'DUPLICATE': {
      const id = crypto.randomUUID();
      const filterSet = { filter: cloneDeep(state[payload.id].filter) };

      payload.callback?.({ filterSet, id });

      return { ...state, [id]: filterSet };
    }
    case 'UPDATE': {
      const { id, filter: newFilter } = payload;
      const filterSet = { ...state[id], filter: cloneDeep(newFilter) };

      payload.callback?.({ filterSet, id });

      return { ...state, [id]: filterSet };
    }
    default:
      return state;
  }
}

export default function useFilterSetWorkspace() {
  const { explorerFilter, handleFilterChange } = useExplorerState();
  const initialWsState = useMemo(() => {
    const wsState = initializeWorkspaceState(explorerFilter);

    // sync filter UI with non-empty initial filter
    const values = Object.values(wsState);
    if (values.length > 1 || !checkIfFilterEmpty(values[0].filter))
      handleFilterChange(values[0].filter);

    return wsState;
  }, []);
  const [id, setId] = useState(Object.keys(initialWsState)[0]);
  const [wsState, dispatch] = useReducer(reducer, initialWsState);
  useEffect(() => storeWorkspaceState(wsState), [wsState]);

  /** @param {FilterSetWorkspaceMethodCallback} [callback] */
  function create(callback) {
    dispatch({
      type: 'CREATE',
      payload: {
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
        id: shouldOverwrite ? id : undefined,
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
      active: { id, filterSet: wsState[id] },
      all: wsState,
      size: Object.keys(wsState).length,
      create,
      duplicate,
      load,
      remove,
      update,
      use,
    }),
    [id, wsState]
  );
}
