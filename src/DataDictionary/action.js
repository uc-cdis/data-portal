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
 * @param {DdgraphState['canvasBoundingRect']} payload
 * @returns {AnyAction}
 */
export const setCanvasBoundingRect = (payload) => ({
  type: 'GRAPH_UPDATE_CANVAS_BOUNDING_RECT',
  payload,
});

/**
 * @param {DdgraphState['secondHighlightingNodeCandidateIDs']} payload
 * @returns {AnyAction}
 */
export const setSecondHighlightingNodeCandidateIDs = (payload) => ({
  type: 'GRAPH_UPDATE_SECOND_HIGHLIGHTING_NODE_CANDIDATES',
  payload,
});

/**
 * @param {DdgraphState['pathRelatedToSecondHighlightingNode']} payload
 * @returns {AnyAction}
 */
export const setPathRelatedToSecondHighlightingNode = (payload) => ({
  type: 'GRAPH_UPDATE_PATH_RELATED_TO_SECOND_HIGHLIGHTING_NODE',
  payload,
});

/**
 * @param {Object} payload
 * @param {DdgraphState['dataModelStructure']} payload.dataModelStructure
 * @param {DdgraphState['dataModelStructureRelatedNodeIDs']} payload.dataModelStructureRelatedNodeIDs
 * @param {DdgraphState['routesBetweenStartEndNodes']} payload.routesBetweenStartEndNodes
 * @returns {AnyAction}
 */
export const setDataModelStructure = (payload) => ({
  type: 'GRAPH_UPDATE_DATA_MODEL_STRUCTURE',
  payload,
});

/**
 * @param {DdgraphState['relatedNodeIDs']} payload
 * @returns {AnyAction}
 */
export const setRelatedNodeIDs = (payload) => ({
  type: 'GRAPH_UPDATE_RELATED_HIGHLIGHTING_NODE',
  payload,
});

/**
 * @param {GraphLayout} payload
 * @returns {AnyAction}
 */
export const setGraphLayout = (payload) => ({
  type: 'GRAPH_LAYOUT_CALCULATED',
  payload,
});

/**
 * @param {DdgraphState['legendItems']} payload
 * @returns {AnyAction}
 */
export const setGraphLegend = (payload) => ({
  type: 'GRAPH_LEGEND_CALCULATED',
  payload,
});

/**
 * @param {GraphNode['id']} payload
 * @returns {AnyAction}
 */
export const hoverNode = (payload) => ({
  type: 'GRAPH_UPDATE_HOVERING_NODE',
  payload,
});

/**
 * @param {GraphNode['id']} payload
 * @returns {AnyAction}
 */
export const clickNode = (payload) => ({
  type: 'GRAPH_CLICK_NODE',
  payload,
});

/** @returns {AnyAction} */
export const resetGraphHighlight = () => ({
  type: 'GRAPH_RESET_HIGHLIGHT',
});

/**
 * @param {DdgraphState['overlayPropertyHidden']} payload
 * @returns {AnyAction}
 */
export const setOverlayPropertyTableHidden = (payload) => ({
  type: 'GRAPH_SET_OVERLAY_PROPERTY_TABLE_HIDDEN',
  payload,
});

/**
 * @param {GraphNode['id']} payload
 * @returns {AnyAction}
 */
export const setExpandNode = (payload) => ({
  type: 'TABLE_EXPAND_NODE',
  payload,
});

/**
 * @param {DdgraphState['isGraphView']} payload
 * @returns {AnyAction}
 */
export const setGraphView = (payload) => ({
  type: 'TOGGLE_GRAPH_TABLE_VIEW',
  payload,
});

/**
 * @param {DdgraphState['needReset']} payload
 * @returns {AnyAction}
 */
export const setNeedReset = (payload) => ({
  type: 'GRAPH_CANVAS_RESET_REQUIRED',
  payload,
});

/**
 * @param {DdgraphState['isSearching']} payload
 * @returns {AnyAction}
 */
export const setIsSearching = (payload) => ({
  type: 'SEARCH_SET_IS_SEARCHING_STATUS',
  payload,
});

/**
 * @typedef {Object} SearchResultSummary
 * @param {DdgraphState['matchedNodeIDs']} generalMatchedNodeIDs
 * @param {DdgraphState['matchedNodeIDsInNameAndDescription']} matchedNodeIDsInNameAndDescription
 * @param {DdgraphState['matchedNodeIDsInProperties']} matchedNodeIDsInProperties
 */

/**
 * @param {Object} payload
 * @param {DdgraphState['searchResult']} payload.searchResult
 * @param {SearchResultSummary} payload.searchResultSummary
 * @returns {AnyAction}
 */
export const setSearchResult = (payload) => ({
  type: 'SEARCH_RESULT_UPDATED',
  payload,
});

/** @returns {AnyAction} */
export const clearSearchHistoryItems = () => ({
  type: 'SEARCH_CLEAR_HISTORY',
});

/**
 * @param {SearchHistoryItem} payload
 * @returns {AnyAction}
 */
export const addSearchHistoryItem = (payload) => ({
  type: 'SEARCH_HISTORY_ITEM_CREATED',
  payload,
});

/**
 * @param {DdgraphState['graphNodesSVGElements']} payload
 * @returns {AnyAction}
 */
export const setGraphNodesSVGElements = (payload) => ({
  type: 'GRAPH_NODES_SVG_ELEMENTS_UPDATED',
  payload,
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
 * @param {boolean} payload
 * @returns {AnyAction}
 */
export const setHighlightingMatchedNodeOpened = (payload) => ({
  type: 'GRAPH_MATCHED_NODE_OPENED',
  payload,
});

/**
 * @param {DdgraphState['graphvizLayout']} payload
 * @returns {AnyAction}
 */
export const receiveGraphvizLayout = (payload) => ({
  type: 'RECEIVE_GRAPHVIZ_LAYOUT',
  payload,
});
