import { connect } from 'react-redux';
import {
  hoverNode,
  clickNode,
  setGraphNodesSVGElements,
} from '../../action';
import GraphDrawer from './GraphDrawer';

const ReduxGraphDrawer = (() => {
  const mapStateToProps = state => ({
    nodes: state.ddgraph.nodes,
    edges: state.ddgraph.edges,
    graphBoundingBox: state.ddgraph.graphBoundingBox,
    layoutInitialized: state.ddgraph.layoutInitialized,
    highlightingNode: state.ddgraph.highlightingNode,
    relatedNodeIDs: state.ddgraph.relatedNodeIDs,
    secondHighlightingNodeCandidateIDs: state.ddgraph.secondHighlightingNodeCandidateIDs,
    pathRelatedToSecondHighlightingNode: state.ddgraph.pathRelatedToSecondHighlightingNode,
    secondHighlightingNodeID: state.ddgraph.secondHighlightingNodeID,
    isGraphView: state.ddgraph.isGraphView,
    matchedNodeIDs: state.ddgraph.matchedNodeIDs,
    matchedNodeIDsInNameAndDescription: state.ddgraph.matchedNodeIDsInNameAndDescription,
    searchResult: state.ddgraph.searchResult,
    isSearchMode: state.ddgraph.isSearchMode,
  });

  const mapDispatchToProps = dispatch => ({
    onHoverNode: nodeID => dispatch(hoverNode(nodeID)),
    onCancelHoverNode: () => dispatch(hoverNode(null)),
    onClickNode: nodeID => dispatch(clickNode(nodeID)),
    onGraphNodesSVGElementsUpdated: graphNodesSVGElements =>
      dispatch(setGraphNodesSVGElements(graphNodesSVGElements)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(GraphDrawer);
})();

export default ReduxGraphDrawer;
