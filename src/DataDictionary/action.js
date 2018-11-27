export const clickBlankSpace = () => ({
  type: 'GRAPH_CLICK_BLANK_SPACE',
});

export const setCanvasBoundingRect = canvasBoundingRect => ({
  type: 'GRAPH_CANVAS_BOUNDING_RECT_UPDATE',
  canvasBoundingRect,
});

export const setFurtherClickableNodeIDs = clickableHighlightedNodeIDs => ({
  type: 'GRAPH_FURTHER_CLICKABLE_NODES',
  clickableHighlightedNodeIDs,
});

export const setFurtherHighlightedPath = furtherHighlightedPath => ({
  type: 'GRAPH_FURTHER_HIGHLIGHT_PATH',
  furtherHighlightedPath,
});

export const setDataModelStructure = dataModelStructure => ({
  type: 'GRAPH_DATA_MODEL_STRUCTURE',
  dataModelStructure,
});

export const setRelatedNodeIDs = relatedNodeIDs => ({
  type: 'GRAPH_RELATED_NODE',
  relatedNodeIDs,
});

export const setGraphLayout = layout => ({
  type: 'GRAPH_LAYOUT',
  nodes: layout.nodes,
  edges: layout.edges,
  graphBoundingBox: layout.graphBoundingBox,
});

export const setGraphLegend = legendItems => ({
  type: 'GRAPH_LEGEND',
  legendItems,
});

export const setHoveringNode = (node, hoveringNodeSVGElement) => ({
  type: 'GRAPH_HOVER_NODE',
  node,
  hoveringNodeSVGElement,
});

export const setHighlightingNode = (node, highlightingNodeSVGElement) => ({
  type: 'GRAPH_HIGHLIGHT_NODE',
  node,
  highlightingNodeSVGElement,
});

export const setFurtherHighlightingNodeID = nodeID => ({
  type: 'GRAPH_FURTHER_HIGHLIGHT_NODE',
  nodeID,
});

export const setOverlayPropertyTableHidden = isHidden => ({
  type: 'GRAPH_OVERLAY_PROPERTY_HIDDEN',
  isHidden,
});

export const setExpandNode = nodeID => ({
  type: 'TABLE_EXPAND_NODE_ID',
  nodeID,
});

export const setGraphView = isGraphView => ({
  type: 'GRAPH_TABLE_VIEW',
  isGraphView,
});

export const setNeedReset = needReset => ({
  type: 'GRAPH_CANVAS_NEED_RESET',
  needReset,
});

export const setHighlightingNodeSVGElement = highlightingNodeSVGElement => ({
  type: 'GRAPH_HIGHLIGHTING_NODE_SVG_ELEMENT',
  highlightingNodeSVGElement,
});

