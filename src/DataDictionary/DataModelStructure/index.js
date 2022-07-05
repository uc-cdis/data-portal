import { connect } from 'react-redux';
import {
  setGraphView,
  setOverlayPropertyTableHidden,
  setNeedReset,
} from '../../redux/ddgraph/slice';
import DataModelStructure from './DataModelStructure';

const ReduxDataModelStructure = (() => {
  /** @param {import('../../redux/types').RootState} state */
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

  /** @param {import('../../redux/types').AppDispatch} dispatch */
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
