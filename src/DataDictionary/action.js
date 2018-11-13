export const clickBlankSpace = () => ({
  type: 'GRAPH_CLICK_BLANK_SPACE',
});

export const setSVGCTM = svgCTM => ({
  type: 'GRAPH_CANVAS_UPDATE',
  svgCTM,
});

export const setCanvasBoundingRect = (canvasBoundingRect) => ({
  type: 'GRAPH_CANVAS_BOUNDING_RECT',
  canvasBoundingRect,
});

export const setFurtherClickableNodeIDs = furtherClickableNodeIDs => ({
  type: 'GRAPH_FURTHER_CLICKABLE_NODES',
  furtherClickableNodeIDs,
});

export const setFurtherHighlightedPath = furtherHighlightedPath => ({
  type: 'GRAPH_FURTHER_HIGHLIGHT_PATH',
  furtherHighlightedPath,
});

export const setDataModelStructure = (dataModelStructure) => ({
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
  hoveringNode: null,
  highlightingNode: null,
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