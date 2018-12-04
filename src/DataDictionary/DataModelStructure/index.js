import { connect } from 'react-redux';
import { setGraphView, setOverlayPropertyTableHidden, setNeedReset } from '../action.js';
import DataModelStructure from './DataModelStructure';

const ReduxDataModelStructure = (() => {
  const mapStateToProps = state => ({
    dataModelStructure: state.ddgraph.dataModelStructure,
    isGraphView: state.ddgraph.isGraphView,
    overlayPropertyHidden: state.ddgraph.overlayPropertyHidden,
  });

  const mapDispatchToProps = dispatch => ({
    onSetGraphView: isGraphView => dispatch(setGraphView(isGraphView)),
    onSetOverlayPropertyTableHidden: hidden => dispatch(setOverlayPropertyTableHidden(hidden)),
    onResetGraphCanvas: () => dispatch(setNeedReset(true)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(DataModelStructure);
})();

export default ReduxDataModelStructure;
