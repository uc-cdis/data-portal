import { connect } from 'react-redux';
import { setGraphView } from './action.js';
import DataDictionary from './DataDictionary';

/** @typedef {import('./types').DdgraphState} DdgraphState */
/** @typedef {import('../types').VersionInfoState} VersionInfoState */

const ReduxDataDictionary = (() => {
  /** @param {{ ddgraph: DdgraphState, versionInfo: VersionInfoState }} state */
  const mapStateToProps = (state) => ({
    isGraphView: state.ddgraph.isGraphView,
    ...state.versionInfo,
  });

  /** @param {import('redux').Dispatch} dispatch */
  const mapDispatchToProps = (dispatch) => ({
    onSetGraphView: (isGraphView) => {
      dispatch(setGraphView(isGraphView));
    },
  });

  return connect(mapStateToProps, mapDispatchToProps)(DataDictionary);
})();

export default ReduxDataDictionary;
