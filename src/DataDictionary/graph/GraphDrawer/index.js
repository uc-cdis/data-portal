import { connect } from 'react-redux';
import {
  setHoveringNode,
  setHighlightingNode,
  setSecondHighlightingNodeID,
  setHighlightingNodeSVGElement,
} from '../../action.js';
import GraphDrawer from './GraphDrawer';

const ReduxGraphDrawer = (() => {
  const mapStateToProps = state => ({
    nodes: state.ddgraph.nodes,
    edges: state.ddgraph.edges,
    graphBoundingBox: state.ddgraph.graphBoundingBox,
    layoutInitialized: state.ddgraph.layoutInitialized,
    highlightingNode: state.ddgraph.highlightingNode,
    highlightingNodeSVGElement: state.ddgraph.highlightingNodeSVGElement,
    relatedNodeIDs: state.ddgraph.relatedNodeIDs,
    secondHighlightingNodeCandidateIDs: state.ddgraph.secondHighlightingNodeCandidateIDs,
    pathRelatedToSecondHighlightingNode: state.ddgraph.pathRelatedToSecondHighlightingNode,
    secondHighlightingNodeID: state.ddgraph.secondHighlightingNodeID,
    isGraphView: state.ddgraph.isGraphView,
  });

  const mapDispatchToProps = dispatch => ({
    onHoverNode: (node, hoveringNodeSVGElement) =>
      dispatch(setHoveringNode(node, hoveringNodeSVGElement)),
    onCancelHoverNode: () => dispatch(setHoveringNode(null)),
    onClickNode: (node, highlightingNodeSVGElement) =>
      dispatch(setHighlightingNode(node, highlightingNodeSVGElement)),
    onClickNodeAsSecondHighlightingNode: nodeID => dispatch(setSecondHighlightingNodeID(nodeID)),
    onHighlightingNodeSVGElementUpdated: highlightingNodeSVGElement =>
      dispatch(setHighlightingNodeSVGElement(highlightingNodeSVGElement)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(GraphDrawer);
})();

export default ReduxGraphDrawer;
