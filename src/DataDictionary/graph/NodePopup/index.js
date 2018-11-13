import { connect } from 'react-redux';
import {
  setHighlightingNode,
  setOverlayPropertyTableHidden,
} from '../../action.js';
import NodePopup from './NodePopup';

const ReduxNodePopup = (() => {
  const mapStateToProps = state => ({
    highlightingNode: state.ddgraph.highlightingNode,
    highlightingNodeSVGElement: state.ddgraph.highlightingNodeSVGElement,
    svgCTM: state.ddgraph.svgCTM,
    canvasBoundingRect: state.ddgraph.canvasBoundingRect,
  });

  const mapDispatchToProps = dispatch => ({
    onClosePopup: () => dispatch(setHighlightingNode(null)),
    onOpenOverlayPropertyTable: () => dispatch(setOverlayPropertyTableHidden(false)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(NodePopup);
})();

export default ReduxNodePopup;
