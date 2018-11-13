import { connect } from 'react-redux';
import DataModelStructure from './DataModelStructure';

const setGraphView = isGraphView => ({
  type: 'GRAPH_TABLE_VIEW',
  isGraphView,
});

const setOverlayPropertyTableHidden = isHidden => ({
  type: 'GRAPH_OVERLAY_PROPERTY_HIDDEN',
  isHidden,
});

const ReduxDataModelStructure = (() => {
  const mapStateToProps = state => ({
    dataModelStructure: state.ddgraph.dataModelStructure,
    isGraphView: state.ddgraph.isGraphView,
  });

  const mapDispatchToProps = dispatch => ({
    onSetGraphView: (isGraphView) => dispatch(setGraphView(isGraphView)),
    onOpenOverlayPropertyTable: () => dispatch(setOverlayPropertyTableHidden(false)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(DataModelStructure);
})();

export default ReduxDataModelStructure;