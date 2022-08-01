import { connect } from 'react-redux';
import {
  hoverNode,
  clickNode,
  setGraphNodesSVGElements,
} from '../../../redux/ddgraph/slice';
import GraphDrawer from './GraphDrawer';

/** @typedef {import('../../../redux/types').RootState} RootState */
/** @typedef {import('../../types').GraphNode} GraphNode */

const ReduxGraphDrawer = (() => {
  /** @param {RootState} state */
  const mapStateToProps = (state) => ({
    nodes: state.ddgraph.nodes,
    edges: state.ddgraph.edges,
    graphBoundingBox: state.ddgraph.graphBoundingBox,
    layoutInitialized: state.ddgraph.layoutInitialized,
    highlightingNode: state.ddgraph.highlightingNode,
    relatedNodeIDs: state.ddgraph.relatedNodeIDs,
    secondHighlightingNodeCandidateIDs:
      state.ddgraph.secondHighlightingNodeCandidateIDs,
    pathRelatedToSecondHighlightingNode:
      state.ddgraph.pathRelatedToSecondHighlightingNode,
    secondHighlightingNodeID: state.ddgraph.secondHighlightingNodeID,
    isGraphView: state.ddgraph.isGraphView,
    matchedNodeIDs: state.ddgraph.matchedNodeIDs,
    matchedNodeIDsInNameAndDescription:
      state.ddgraph.matchedNodeIDsInNameAndDescription,
    searchResult: state.ddgraph.searchResult,
    isSearchMode: state.ddgraph.isSearchMode,
  });

  /** @param {import('../../../redux/types').AppDispatch} dispatch */
  const mapDispatchToProps = (dispatch) => ({
    /** @param {RootState['ddgraph']['hoveringNode']['id']} nodeId */
    onHoverNode: (nodeId) => dispatch(hoverNode(nodeId)),
    onCancelHoverNode: () => dispatch(hoverNode(null)),
    /** @param {GraphNode['id']} nodeId */
    onClickNode: (nodeId) => dispatch(clickNode(nodeId)),
    /** @param {RootState['ddgraph']['graphNodesSVGElements']} graphNodesSVGElements */
    onGraphNodesSVGElementsUpdated: (graphNodesSVGElements) =>
      dispatch(setGraphNodesSVGElements(graphNodesSVGElements)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(GraphDrawer);
})();

export default ReduxGraphDrawer;
