export const clickBlankSpace = () => ({
  type: 'GRAPH_CLICK_BLANK_SPACE',
});

export const setCanvasBoundingRect = canvasBoundingRect => ({
  type: 'GRAPH_UPDATE_CANVAS_BOUNDING_RECT',
  canvasBoundingRect,
});

export const setSecondHighlightingNodeCandidateIDs = secondHighlightingNodeCandidateIDs => ({
  type: 'GRAPH_UPDATE_SECOND_HIGHLIGHTING_NODE_CANDIDATES',
  secondHighlightingNodeCandidateIDs,
});

export const setPathRelatedToSecondHighlightingNode = pathRelatedToSecondHighlightingNode => ({
  type: 'GRAPH_UPDATE_PATH_RELATED_TO_SECOND_HIGHLIGHTING_NODE',
  pathRelatedToSecondHighlightingNode,
});

export const setDataModelStructure = dataModelStructure => ({
  type: 'GRAPH_UPDATE_DATA_MODEL_STRUCTURE',
  dataModelStructure,
});

export const setRelatedNodeIDs = relatedNodeIDs => ({
  type: 'GRAPH_UPDATE_RELATED_HIGHLIGHTING_NODE',
  relatedNodeIDs,
});

export const setGraphLayout = layout => ({
  type: 'GRAPH_LAYOUT_CALCULATED',
  nodes: layout.nodes,
  edges: layout.edges,
  graphBoundingBox: layout.graphBoundingBox,
});

export const setGraphLegend = legendItems => ({
  type: 'GRAPH_LEGEND_CALCULATED',
  legendItems,
});

export const setHoveringNode = (node, hoveringNodeSVGElement) => ({
  type: 'GRAPH_UPDATE_HOVERING_NODE',
  node,
  hoveringNodeSVGElement,
});

export const setHighlightingNode = (node, highlightingNodeSVGElement) => ({
  type: 'GRAPH_UPDATE_HIGHLIGHTING_NODE',
  node,
  highlightingNodeSVGElement,
});

export const setSecondHighlightingNodeID = nodeID => ({
  type: 'GRAPH_SECOND_HIGHLIGHTING_NODE',
  nodeID,
});

export const setOverlayPropertyTableHidden = isHidden => ({
  type: 'GRAPH_SET_OVERLAY_PROPERTY_TABLE_HIDDEN',
  isHidden,
});

export const setExpandNode = nodeID => ({
  type: 'TABLE_EXPAND_NODE',
  nodeID,
});

export const setGraphView = isGraphView => ({
  type: 'TOGGLE_GRAPH_TABLE_VIEW',
  isGraphView,
});

export const setNeedReset = needReset => ({
  type: 'GRAPH_CANVAS_RESET_REQUIRED',
  needReset,
});

export const setHighlightingNodeSVGElement = highlightingNodeSVGElement => ({
  type: 'GRAPH_HIGHLIGHTING_NODE_SVG_ELEMENT_UPDATED',
  highlightingNodeSVGElement,
});

