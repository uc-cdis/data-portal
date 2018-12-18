import { connect } from 'react-redux';
import {
  setHoveringNode,
  setHighlightingNode,
  setSecondHighlightingNodeID,
  setHighlightingNodeSVGElement,
  setGraphNodesSVGElements,
  setMatchedNodeExpandingStatus,
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
    matchedNodeIDs: state.ddgraph.matchedNodeIDs,
    searchResult: state.ddgraph.searchResult,
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
    onGraphNodesSVGElementsUpdated: graphNodesSVGElements =>
      dispatch(setGraphNodesSVGElements(graphNodesSVGElements)),
    onExpandMatchedNode: nodeID => dispatch(setMatchedNodeExpandingStatus(nodeID, true)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(GraphDrawer);
})();

export default ReduxGraphDrawer;
