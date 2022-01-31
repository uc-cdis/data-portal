import { connect } from 'react-redux';
import {
  setGraphView,
  setOverlayPropertyTableHidden,
  setNeedReset,
} from '../action.js';
import DataModelStructure from './DataModelStructure';

/** @typedef {import('../types').DdgraphState} DdgraphState */
/** @typedef {import('../../types').VersionInfoState} VersionInfoState */

const ReduxDataModelStructure = (() => {
  /** @param {{ ddgraph: DdgraphState; versionInfo: VersionInfoState }} state */
  const mapStateToProps = (state) => ({
    dataModelStructure: state.ddgraph.dataModelStructure,
    isGraphView: state.ddgraph.isGraphView,
    overlayPropertyHidden: state.ddgraph.overlayPropertyHidden,
    relatedNodeIDs: state.ddgraph.dataModelStructureRelatedNodeIDs,
    allRoutes: state.ddgraph.dataModelStructureAllRoutesBetween,
    clickingNodeName: state.ddgraph.highlightingNode
      ? state.ddgraph.highlightingNode.label
      : '',
    dictionaryVersion: state.versionInfo.dictionaryVersion,
  });

  /** @param {import('redux').Dispatch} dispatch */
  const mapDispatchToProps = (dispatch) => ({
    onSetGraphView: (isGraphView) => {
      dispatch(setGraphView(isGraphView));
    },
    onSetOverlayPropertyTableHidden: (hidden) => {
      dispatch(setOverlayPropertyTableHidden(hidden));
    },
    onResetGraphCanvas: () => {
      dispatch(setNeedReset(true));
    },
  });

  return connect(mapStateToProps, mapDispatchToProps)(DataModelStructure);
})();

export default ReduxDataModelStructure;
