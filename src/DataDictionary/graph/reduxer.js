import { connect } from 'react-redux';
import GraphCalculator from './GraphCalculator';
import GraphDrawer from './GraphDrawer';
import Legend from './Legend';
import Canvas from './Canvas';
import NodeTooltip from './NodeTooltip';
import NodePopup from './NodePopup';

const setGraphLayout = layout => ({
  type: 'GRAPH_LAYOUT',
  nodes: layout.nodes,
  edges: layout.edges,
  graphBoundingBox: layout.graphBoundingBox,
  hoveringNode: null,
  highlightingNode: null,
});

const setGraphLegend = legendItems => ({
  type: 'GRAPH_LEGEND',
  legendItems,
});

const setHoveringNode = (node, hoveringNodeSVGElement) => ({
  type: 'GRAPH_HOVER_NODE',
  node,
  hoveringNodeSVGElement,
});

const setHighlightingNode = (node, highlightingNodeSVGElement) => ({
  type: 'GRAPH_HIGHLIGHT_NODE',
  node,
  highlightingNodeSVGElement,
});

const setSVGCTM = svgCTM => ({
  type: 'GRAPH_CANVAS_UPDATE',
  svgCTM,
});

const setRelatedNodeIDs = relatedNodeIDs => ({
  type: 'GRAPH_RELATED_NODE',
  relatedNodeIDs,
});

const setFurtherHighlightingNodeID = nodeID => ({
  type: 'GRAPH_FURTHER_HIGHLIGHT_NODE',
  nodeID,
});

const setFurtherClickableNodeIDs = furtherClickableNodeIDs => ({
  type: 'GRAPH_FURTHER_CLICKABLE_NODES',
  furtherClickableNodeIDs,
});

const setFurtherHighlightedPath = furtherHighlightedPath => ({
  type: 'GRAPH_FURTHER_HIGHLIGHT_PATH',
  furtherHighlightedPath,
});

const clickBlankSpace = () => ({
  type: 'GRAPH_CLICK_BLANK_SPACE',
});

export const ReduxGraphCalculator = (() => {
  const mapStateToProps = state => ({
    dictionary: state.submission.dictionary,
    countsSearch: state.submission.counts_search,
    linksSearch: state.submission.links_search,
    highlightingNode: state.ddgraph.highlightingNode,
    nodes: state.ddgraph.nodes,
    edges: state.ddgraph.edges,
    furtherHighlightingNodeID: state.ddgraph.furtherHighlightingNodeID,
  });

  const mapDispatchToProps = dispatch => ({
    onGraphLayoutCalculated: layout => dispatch(setGraphLayout(layout)),
    onGraphLegendCalculated: legendItems => dispatch(setGraphLegend(legendItems)),
    onHighlightRelatedNodesCalculated: relatedNodeIDs => dispatch(setRelatedNodeIDs(relatedNodeIDs)),
    onFurtherClickableNodeIDsCalculated: furtherClickableNodeIDs => dispatch(setFurtherClickableNodeIDs(furtherClickableNodeIDs)),
    onFurtherHighlightedPathCalculated: furtherHighlightedPath => dispatch(setFurtherHighlightedPath(furtherHighlightedPath)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(GraphCalculator);
})();

export const ReduxGraphDrawer = (() => {
  const mapStateToProps = state => ({
    nodes: state.ddgraph.nodes,
    edges: state.ddgraph.edges,
    graphBoundingBox: state.ddgraph.graphBoundingBox,
    layoutInitialized: state.ddgraph.layoutInitialized,
    hoveringNode: state.ddgraph.hoveringNode,
    highlightingNode: state.ddgraph.highlightingNode,
    relatedNodeIDs: state.ddgraph.relatedNodeIDs,
    furtherClickableNodeIDs: state.ddgraph.furtherClickableNodeIDs,
    furtherHighlightedPath: state.ddgraph.furtherHighlightedPath,
    furtherHighlightingNodeID: state.ddgraph.furtherHighlightingNodeID,
  });

  const mapDispatchToProps = dispatch => ({
    onHoverNode: (node, hoveringNodeSVGElement) =>
      dispatch(setHoveringNode(node, hoveringNodeSVGElement)),
    onCancelHoverNode: () => dispatch(setHoveringNode(null)),
    onClickNode: (node, highlightingNodeSVGElement) =>
      dispatch(setHighlightingNode(node, highlightingNodeSVGElement)),
    onFurtherClickNode: nodeID => dispatch(setFurtherHighlightingNodeID(nodeID)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(GraphDrawer);
})();

export const ReduxLegend = (() => {
  const mapStateToProps = state => ({
    items: state.ddgraph.legendItems,
  });

  return connect(mapStateToProps)(Legend);
})();

export const ReduxCanvas = (() => {
  const mapStateToProps = state => ({
  });

  const mapDispatchToProps = dispatch => ({
    onClickBlankSpace: () => dispatch(clickBlankSpace()),
    onCanvasUpdate: svgCTM => dispatch(setSVGCTM(svgCTM)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(Canvas);
})();

export const ReduxNodeTooltip = (() => {
  const mapStateToProps = state => ({
    hoveringNode: state.ddgraph.hoveringNode,
    hoveringNodeSVGElement: state.ddgraph.hoveringNodeSVGElement,
    svgCTM: state.ddgraph.svgCTM,
  });

  return connect(mapStateToProps)(NodeTooltip);
})();

export const ReduxNodePopup = (() => {
  const mapStateToProps = state => ({
    highlightingNode: state.ddgraph.highlightingNode,
    highlightingNodeSVGElement: state.ddgraph.highlightingNodeSVGElement,
    svgCTM: state.ddgraph.svgCTM,
  });

  const mapDispatchToProps = dispatch => ({
    onClosePopup: () => dispatch(setHighlightingNode(null)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(NodePopup);
})();
