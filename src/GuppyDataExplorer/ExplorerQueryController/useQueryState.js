import { useMemo, useReducer, useState } from 'react';
import cloneDeep from 'lodash.clonedeep';

/** @typedef {import("../types").ExplorerFilter} ExplorerFilter */
/** @typedef {import('./types').QueryState} QueryState */
/** @typedef {import('./types').QueryStateAction} QueryStateAction */
/** @typedef {import('./types').QueryStateActionCallback} QueryStateActionCallback */

/**
 * @param {QueryState} state
 * @param {QueryStateAction} action
 */
function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case 'CREATE': {
      const id = crypto.randomUUID();
      const filter = /** @type {ExplorerFilter} */ ({});

      payload.callback?.({ filter, id });

      return { ...state, [id]: filter };
    }
    case 'REMOVE': {
      const newState = cloneDeep(state);
      delete newState[payload.id];

      const [id, filter] = Object.entries(newState)[0];
      payload.callback?.({ filter, id });

      return newState;
    }
    case 'DUPLICATE': {
      const id = crypto.randomUUID();
      const filter = cloneDeep(state[payload.id]);

      payload.callback?.({ filter, id });

      return { ...state, [id]: filter };
    }
    case 'UPDATE': {
      const { id, filter: newFilter } = payload;
      const filter = cloneDeep(newFilter);

      payload.callback?.({ filter, id });

      return { ...state, [id]: filter };
    }
    default:
      return state;
  }
}

/** @param {ExplorerFilter} initialFilter */
export default function useQueryState(initialFilter) {
  const [id, setId] = useState(crypto.randomUUID());
  const [state, dispatch] = useReducer(reducer, { [id]: initialFilter });

  /** @param {(filter: ExplorerFilter) => void} [callback] */
  function create(callback) {
    dispatch({
      type: 'CREATE',
      payload: {
        callback(args) {
          setId(args.id);
          callback?.(args.filter);
        },
      },
    });
  }
  /** @param {(filter: ExplorerFilter) => void} [callback] */
  function duplicate(callback) {
    dispatch({
      type: 'DUPLICATE',
      payload: {
        id,
        callback(args) {
          setId(args.id);
          callback?.(args.filter);
        },
      },
    });
  }

  /** @param {(filter: ExplorerFilter) => void} [callback] */
  function remove(callback) {
    dispatch({
      type: 'REMOVE',
      payload: {
        id,
        callback(args) {
          setId(args.id);
          callback?.(args.filter);
        },
      },
    });
  }

  /**
   * @param {ExplorerFilter} newFilter
   * @param {(filter: ExplorerFilter) => void} [callback]
   */
  function update(newFilter, callback) {
    dispatch({
      type: 'UPDATE',
      payload: {
        id,
        filter: newFilter,
        callback(args) {
          setId(args.id);
          callback?.(args.filter);
        },
      },
    });
  }

  /**
   * @param {string} newId
   * @param {(filter: ExplorerFilter) => void} callback
   */
  function use(newId, callback) {
    setId(newId);
    callback?.(state[newId]);
  }

  return useMemo(
    () => ({
      all: state,
      current: { id, filter: state[id] },
      size: Object.keys(state).length,
      create,
      duplicate,
      remove,
      update,
      use,
    }),
    [id, state]
  );
}
