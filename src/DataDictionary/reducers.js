const ddgraphInitialState = {
  isGraphView: true,
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
  furtherHighlightingNodeID: null,
  dataModelStructure: null,
  overlayPropertyHidden: true,
  canvasBoundingRect: { top: 0, left: 0 },
};

const ddgraph = (state = ddgraphInitialState, action) => {
  switch (action.type) {
  case 'GRAPH_TABLE_VIEW': {
    return {
      ...state,
      isGraphView: action.isGraphView,
    };
  }
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
  case 'GRAPH_CANVAS_BOUNDING_RECT': {
    return {
      ...state,
      canvasBoundingRect: action.canvasBoundingRect,
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
  case 'TABLE_EXPAND_NODE_ID': {
    let newHighlightingNode = null;
    const newFurtherHighlightingNodeID = null;
    if (action.nodeID) {
      newHighlightingNode = state.nodes.find(n => n.id === action.nodeID);
    }
    return {
      ...state,
      tableExpandNodeID: action.nodeID,
      highlightingNode: newHighlightingNode,
      furtherHighlightingNodeID: newFurtherHighlightingNodeID,
    };
  }
  case 'GRAPH_DATA_MODEL_STRUCTURE': {
    return {
      ...state,
      dataModelStructure: action.dataModelStructure,
    };
  }
  case 'GRAPH_OVERLAY_PROPERTY_HIDDEN': {
    return {
      ...state,
      overlayPropertyHidden: action.isHidden,
    };
  }
  default:
    return state;
  }
};

export default ddgraph;
