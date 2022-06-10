/* eslint-disable import/prefer-default-export */
import { receiveGraphvizLayout } from './action';

/** @typedef {import('./types').DdgraphState} DdgraphState */

export function fetchGraphvizLayout() {
  /**
   * @param {import('redux').Dispatch} dispatch
   * @param {() => { ddgraph: DdgraphState }} getState
   */
  return (dispatch, getState) =>
    getState().ddgraph.graphvizLayout
      ? Promise.resolve()
      : import('../../data/graphvizLayout.json').then(({ default: data }) => {
          dispatch(
            receiveGraphvizLayout(
              /** @type {DdgraphState['graphvizLayout']} */ (data)
            )
          );
        });
}
