/** @typedef {import('redux').AnyAction} AnyAction */
/** @typedef {import('./types').DdgraphState} DdgraphState */
/** @typedef {import('./types').GraphLayout} GraphLayout */
/** @typedef {import('./types').GraphNode} GraphNode */
/** @typedef {import('./types').SearchHistoryItem} SearchHistoryItem */

/** @returns {AnyAction} */
export const clickBlankSpace = () => ({
  type: 'GRAPH_CLICK_BLANK_SPACE',
});

/**
 * @param {DdgraphState['canvasBoundingRect']} canvasBoundingRect
 * @returns {AnyAction}
 */
export const setCanvasBoundingRect = (canvasBoundingRect) => ({
  type: 'GRAPH_UPDATE_CANVAS_BOUNDING_RECT',
  canvasBoundingRect,
});

/**
 * @param {DdgraphState['secondHighlightingNodeCandidateIDs']} secondHighlightingNodeCandidateIDs
 * @returns {AnyAction}
 */
export const setSecondHighlightingNodeCandidateIDs = (
  secondHighlightingNodeCandidateIDs
) => ({
  type: 'GRAPH_UPDATE_SECOND_HIGHLIGHTING_NODE_CANDIDATES',
  secondHighlightingNodeCandidateIDs,
});

/**
 * @param {DdgraphState['pathRelatedToSecondHighlightingNode']} pathRelatedToSecondHighlightingNode
 * @returns {AnyAction}
 */
export const setPathRelatedToSecondHighlightingNode = (
  pathRelatedToSecondHighlightingNode
) => ({
  type: 'GRAPH_UPDATE_PATH_RELATED_TO_SECOND_HIGHLIGHTING_NODE',
  pathRelatedToSecondHighlightingNode,
});

/**
 * @param {DdgraphState['dataModelStructure']} dataModelStructure
 * @param {DdgraphState['dataModelStructureRelatedNodeIDs']} dataModelStructureRelatedNodeIDs
 * @param {DdgraphState['routesBetweenStartEndNodes']} routesBetweenStartEndNodes
 * @returns {AnyAction}
 */
export const setDataModelStructure = (
  dataModelStructure,
  dataModelStructureRelatedNodeIDs,
  routesBetweenStartEndNodes
) => ({
  type: 'GRAPH_UPDATE_DATA_MODEL_STRUCTURE',
  dataModelStructure,
  dataModelStructureRelatedNodeIDs,
  routesBetweenStartEndNodes,
});

/**
 * @param {DdgraphState['relatedNodeIDs']} relatedNodeIDs
 * @returns {AnyAction}
 */
export const setRelatedNodeIDs = (relatedNodeIDs) => ({
  type: 'GRAPH_UPDATE_RELATED_HIGHLIGHTING_NODE',
  relatedNodeIDs,
});

/**
 * @param {GraphLayout} layout
 * @returns {AnyAction}
 */
export const setGraphLayout = (layout) => ({
  type: 'GRAPH_LAYOUT_CALCULATED',
  nodes: layout.nodes,
  edges: layout.edges,
  graphBoundingBox: layout.graphBoundingBox,
});

/**
 * @param {DdgraphState['legendItems']} legendItems
 * @returns {AnyAction}
 */
export const setGraphLegend = (legendItems) => ({
  type: 'GRAPH_LEGEND_CALCULATED',
  legendItems,
});

/**
 * @param {GraphNode['id']} nodeID
 * @returns {AnyAction}
 */
export const hoverNode = (nodeID) => ({
  type: 'GRAPH_UPDATE_HOVERING_NODE',
  nodeID,
});

/**
 * @param {GraphNode['id']} nodeID
 * @returns {AnyAction}
 */
export const clickNode = (nodeID) => ({
  type: 'GRAPH_CLICK_NODE',
  nodeID,
});

/** @returns {AnyAction} */
export const resetGraphHighlight = () => ({
  type: 'GRAPH_RESET_HIGHLIGHT',
});

/**
 * @param {DdgraphState['overlayPropertyHidden']} isHidden
 * @returns {AnyAction}
 */
export const setOverlayPropertyTableHidden = (isHidden) => ({
  type: 'GRAPH_SET_OVERLAY_PROPERTY_TABLE_HIDDEN',
  isHidden,
});

/**
 * @param {GraphNode['id']} nodeID
 * @returns {AnyAction}
 */
export const setExpandNode = (nodeID) => ({
  type: 'TABLE_EXPAND_NODE',
  nodeID,
});

/**
 * @param {DdgraphState['isGraphView']} isGraphView
 * @returns {AnyAction}
 */
export const setGraphView = (isGraphView) => ({
  type: 'TOGGLE_GRAPH_TABLE_VIEW',
  isGraphView,
});

/**
 * @param {DdgraphState['needReset']} needReset
 * @returns {AnyAction}
 */
export const setNeedReset = (needReset) => ({
  type: 'GRAPH_CANVAS_RESET_REQUIRED',
  needReset,
});

/**
 * @param {DdgraphState['isSearching']} isSearching
 * @returns {AnyAction}
 */
export const setIsSearching = (isSearching) => ({
  type: 'SEARCH_SET_IS_SEARCHING_STATUS',
  isSearching,
});

/**
 * @typedef {Object} SearchResultSummary
 * @param {DdgraphState['matchedNodeIDs']} generalMatchedNodeIDs
 * @param {DdgraphState['matchedNodeIDsInNameAndDescription']} matchedNodeIDsInNameAndDescription
 * @param {DdgraphState['matchedNodeIDsInProperties']} matchedNodeIDsInProperties
 */

/**
 * @param {DdgraphState['searchResult']} searchResult
 * @param {SearchResultSummary} searchResultSummary
 * @returns {AnyAction}
 */
export const setSearchResult = (searchResult, searchResultSummary) => ({
  type: 'SEARCH_RESULT_UPDATED',
  searchResult,
  searchResultSummary,
});

/** @returns {AnyAction} */
export const clearSearchHistoryItems = () => ({
  type: 'SEARCH_CLEAR_HISTORY',
});

/**
 * @param {SearchHistoryItem} searchHistoryItem
 * @returns {AnyAction}
 */
export const addSearchHistoryItem = (searchHistoryItem) => ({
  type: 'SEARCH_HISTORY_ITEM_CREATED',
  searchHistoryItem,
});

/**
 * @param {DdgraphState['graphNodesSVGElements']} graphNodesSVGElements
 * @returns {AnyAction}
 */
export const setGraphNodesSVGElements = (graphNodesSVGElements) => ({
  type: 'GRAPH_NODES_SVG_ELEMENTS_UPDATED',
  graphNodesSVGElements,
});

/** @returns {AnyAction} */
export const clearSearchResult = () => ({
  type: 'SEARCH_RESULT_CLEARED',
});

/**
 * @param {string} keyword
 * @returns {AnyAction}
 */
export const saveCurrentSearchKeyword = (keyword) => ({
  type: 'SEARCH_SAVE_CURRENT_KEYWORD',
  keyword,
});

/**
 * @param {boolean} opened
 * @returns {AnyAction}
 */
export const setHighlightingMatchedNodeOpened = (opened) => ({
  type: 'GRAPH_MATCHED_NODE_OPENED',
  opened,
});
