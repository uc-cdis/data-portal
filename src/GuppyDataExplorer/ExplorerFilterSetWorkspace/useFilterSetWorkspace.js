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

/** @type {UnsavedExplorerFilterSet} */
const EMPTY_WORKSPACE_FILTERSET = { filter: {} };

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
      const filterSet = EMPTY_WORKSPACE_FILTERSET;

      payload.callback?.({ filterSet, id });

      return { ...state, [id]: filterSet };
    }
    case 'CLEAR-ALL': {
      const id = crypto.randomUUID();
      const filterSet = EMPTY_WORKSPACE_FILTERSET;

      payload.callback?.({ filterSet, id });

      return { [id]: filterSet };
    }
    case 'CREATE': {
      const id = crypto.randomUUID();
      const filterSet = EMPTY_WORKSPACE_FILTERSET;

      payload.callback?.({ filterSet, id });

      return { ...state, [id]: filterSet };
    }
    case 'REMOVE': {
      const newState = cloneDeep(state);
      delete newState[payload.id];

      const [firstEntry] = Object.entries(newState);
      const [id, filterSet] = firstEntry ?? [
        crypto.randomUUID(),
        EMPTY_WORKSPACE_FILTERSET,
      ];

      payload.callback?.({ filterSet, id });

      return { ...newState, [id]: filterSet };
    }
    case 'LOAD': {
      const id = payload.id ?? crypto.randomUUID();
      const filterSet = cloneDeep(payload.filterSet);

      payload.callback?.({ filterSet, id });

      return { ...state, [id]: filterSet };
    }
    case 'SAVE': {
      const { filterSet, id } = payload;

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
  const initialWsState = useMemo(
    () => initializeWorkspaceState(explorerFilter),
    []
  );
  useEffect(() => {
    // sync filter UI with non-empty initial workspace filter
    const values = Object.values(initialWsState);
    if (values.length > 1 || !checkIfFilterEmpty(values[0].filter))
      handleFilterChange(values[0].filter);
  }, []);
  const [id, setId] = useState(Object.keys(initialWsState)[0]);
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
