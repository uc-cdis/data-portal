const ddgraphInitialState = {
  layoutInitialized: false,
  nodes: [],
  edges: [],
  graphBoundingBox: [],
  legendItems: [],
  hoveringNode: null,
  hoveringNodeSVGElement: null,
  highlightingNode: null,
  highlightingNodeSVGElement: null,
  relatedNodeIDs: [],
  furtherHighlightingNodeIDs: [],
};

const ddgraph = (state = ddgraphInitialState, action) => {
  switch (action.type) {
  case 'GRAPH_LAYOUT': {
    return {
      ...state,
      nodes: action.nodes,
      edges: action.edges,
      graphBoundingBox: action.graphBoundingBox,
      layoutInitialized: true,
    };
  }
  case 'GRAPH_LEGEND': {
    return {
      ...state,
      legendItems: action.legendItems,
    };
  }
  case 'GRAPH_HOVER_NODE': {
    return {
      ...state,
      hoveringNode: action.node,
      hoveringNodeSVGElement: action.hoveringNodeSVGElement,
    };
  }
  case 'GRAPH_HIGHLIGHT_NODE': {
    let newHighlightingNode = null;
    let newHighlightingNodeSVGElement = null;
    if (action.node && (!state.highlightingNode || state.highlightingNode.id !== action.node.id)) {
      newHighlightingNode = action.node;
      newHighlightingNodeSVGElement = action.highlightingNodeSVGElement;
    }
    return {
      ...state,
      highlightingNode: newHighlightingNode,
      highlightingNodeSVGElement: newHighlightingNodeSVGElement,
    };
  }
  case 'GRAPH_CANVAS_UPDATE': {
    return {
      ...state,
      svgCTM: action.svgCTM,
    };
  }
  case 'GRAPH_RELATED_NODE': {
    return {
      ...state,
      relatedNodeIDs: action.relatedNodeIDs,
    };
  }
  case 'GRAPH_FURTHER_HIGHLIGHT_NODE': {
    const newFurtherHighlightingNodeID = action.nodeID;
    return {
      ...state,
      furtherHighlightingNodeID: newFurtherHighlightingNodeID,
    };
  }
  case 'GRAPH_FURTHER_CLICKABLE_NODES': {
    return {
      ...state,
      furtherClickableNodeIDs: action.furtherClickableNodeIDs,
    };
  }
  case 'GRAPH_FURTHER_HIGHLIGHT_PATH': {
    return {
      ...state,
      furtherHighlightedPath: action.furtherHighlightedPath,
    };
  }
  case 'GRAPH_CLICK_BLANK_SPACE': {
    let newHighlightingNode = state.highlightingNode;
    let newFurtherHighlightingNodeID = state.furtherHighlightingNodeID;
    if (state.highlightingNode) {
      if (state.furtherHighlightingNodeID) {
        newFurtherHighlightingNodeID = null;
      } else {
        newHighlightingNode = null;
      }
    }
    return {
      ...state,
      highlightingNode: newHighlightingNode,
      furtherHighlightingNodeID: newFurtherHighlightingNodeID,
    };
  }
  default:
    return state;
  }
};

export default ddgraph;
