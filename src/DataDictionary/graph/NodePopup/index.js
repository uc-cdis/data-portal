import { connect } from 'react-redux';
import {
  resetGraphHighlight,
  setOverlayPropertyTableHidden,
} from '../../action';
import NodePopup from './NodePopup';

const ReduxNodePopup = (() => {
  const mapStateToProps = state => ({
    highlightingNode: state.ddgraph.highlightingNode,
    canvasBoundingRect: state.ddgraph.canvasBoundingRect,
    graphNodesSVGElements: state.ddgraph.graphNodesSVGElements,
  });

  const mapDispatchToProps = dispatch => ({
    onClosePopup: () => dispatch(resetGraphHighlight()),
    onOpenOverlayPropertyTable: () => dispatch(setOverlayPropertyTableHidden(false)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(NodePopup);
})();

export default ReduxNodePopup;
