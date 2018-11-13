import { connect } from 'react-redux';
import OverlayPropertyTable from './OverlayPropertyTable';

const setOverlayPropertyTableHidden = isHidden => ({
  type: 'GRAPH_OVERLAY_PROPERTY_HIDDEN',
  isHidden,
});

const ReduxOverlayPropertyTable = (() => {
  const mapStateToProps = state => {
    return {
      hidden: state.ddgraph.overlayPropertyHidden,
      node: state.ddgraph.highlightingNode ? state.submission.dictionary[state.ddgraph.highlightingNode.id] : null,
    }
  };

  const mapDispatchToProps = dispatch => ({
    onCloseOverlayPropertyTable: () => dispatch(setOverlayPropertyTableHidden(true)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(OverlayPropertyTable);
})();

export default ReduxOverlayPropertyTable;