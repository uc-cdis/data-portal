import { connect } from 'react-redux';
import {
  resetGraphHighlight,
  setOverlayPropertyTableHidden,
} from '../../../redux/ddgraph/slice';
import NodePopup from './NodePopup';

const ReduxNodePopup = (() => {
  /** @param {import('../../../redux/types').RootState} state */
  const mapStateToProps = (state) => ({
    highlightingNode: state.ddgraph.highlightingNode,
    canvasBoundingRect: state.ddgraph.canvasBoundingRect,
    graphNodesSVGElements: state.ddgraph.graphNodesSVGElements,
  });

  /** @param {import('../../../redux/types').AppDispatch} dispatch */
  const mapDispatchToProps = (dispatch) => ({
    onClosePopup: () => {
      dispatch(resetGraphHighlight());
    },
    onOpenOverlayPropertyTable: () => {
      dispatch(setOverlayPropertyTableHidden(false));
    },
  });

  return connect(mapStateToProps, mapDispatchToProps)(NodePopup);
})();

export default ReduxNodePopup;
