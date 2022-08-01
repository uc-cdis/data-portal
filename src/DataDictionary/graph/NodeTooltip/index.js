import { connect } from 'react-redux';
import NodeTooltip from './NodeTooltip';

const ReduxNodeTooltip = (() => {
  /** @param {import('../../../redux/types').RootState} state */
  const mapStateToProps = (state) => ({
    hoveringNode: state.ddgraph.hoveringNode,
    canvasBoundingRect: state.ddgraph.canvasBoundingRect,
    graphNodesSVGElements: state.ddgraph.graphNodesSVGElements,
  });

  return connect(mapStateToProps)(NodeTooltip);
})();

export default ReduxNodeTooltip;
