import { connect } from 'react-redux';
import { setOverlayPropertyTableHidden } from '../../action.js';
import OverlayPropertyTable from './OverlayPropertyTable';

const ReduxOverlayPropertyTable = (() => {
  const mapStateToProps = state => ({
    hidden: state.ddgraph.overlayPropertyHidden,
    node: state.ddgraph.highlightingNode
      ? state.submission.dictionary[state.ddgraph.highlightingNode.id] : null,
  });

  const mapDispatchToProps = dispatch => ({
    onCloseOverlayPropertyTable: () => dispatch(setOverlayPropertyTableHidden(true)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(OverlayPropertyTable);
})();

export default ReduxOverlayPropertyTable;
