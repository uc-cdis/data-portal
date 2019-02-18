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

export const setDataModelStructure = (
  dataModelStructure,
  dataModelStructureRelatedNodeIDs,
  routesBetweenStartEndNodes,
) => ({
  type: 'GRAPH_UPDATE_DATA_MODEL_STRUCTURE',
  dataModelStructure,
  dataModelStructureRelatedNodeIDs,
  routesBetweenStartEndNodes,
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

export const hoverNode = nodeID => ({
  type: 'GRAPH_UPDATE_HOVERING_NODE',
  nodeID,
});

export const clickNode = nodeID => ({
  type: 'GRAPH_CLICK_NODE',
  nodeID,
});

export const resetGraphHighlight = () => ({
  type: 'GRAPH_RESET_HIGHLIGHT',
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

export const setIsSearching = isSearching => ({
  type: 'SEARCH_SET_IS_SEARCHING_STATUS',
  isSearching,
});

export const setSearchResult = (searchResult, searchResultSummary) => ({
  type: 'SEARCH_RESULT_UPDATED',
  searchResult,
  searchResultSummary,
});

export const clearSearchHistoryItems = () => ({
  type: 'SEARCH_CLEAR_HISTORY',
});

export const addSearchHistoryItem = searchHistoryItem => ({
  type: 'SEARCH_HISTORY_ITEM_CREATED',
  searchHistoryItem,
});

export const setGraphNodesSVGElements = graphNodesSVGElements => ({
  type: 'GRAPH_NODES_SVG_ELEMENTS_UPDATED',
  graphNodesSVGElements,
});

export const clearSearchResult = () => ({
  type: 'SEARCH_RESULT_CLEARED',
});

export const saveCurrentSearchKeyword = keyword => ({
  type: 'SEARCH_SAVE_CURRENT_KEYWORD',
  keyword,
});

export const setHighlightingMatchedNodeOpened = opened => ({
  type: 'GRAPH_MATCHED_NODE_OPENED',
  opened,
});
