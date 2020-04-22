import {
  getSearchHistoryItems,
  clearSearchHistoryItems,
  addSearchHistoryItems,
} from './utils';

const ddgraphInitialState = {
  isGraphView: false,
  layoutInitialized: false,
  nodes: [],
  edges: [],
  graphBoundingBox: [],
  legendItems: [],
  hoveringNode: null,
  highlightingNode: null,
  relatedNodeIDs: [],
  secondHighlightingNodeID: null,
  dataModelStructure: null,
  overlayPropertyHidden: true,
  canvasBoundingRect: { top: 0, left: 0 },
  needReset: false,
  tableExpandNodeID: null,
  searchHistoryItems: getSearchHistoryItems(),
  graphNodesSVGElements: null,
  currentSearchKeyword: '',
  searchResult: [],
  matchedNodeIDs: [],
  matchedNodeIDsInProperties: [],
  matchedNodeIDsInNameAndDescription: [],
  isSearchMode: false,
  isSearching: false,
  highlightingMatchedNodeID: null,
  highlightingMatchedNodeOpened: false,
};

const ddgraph = (state = ddgraphInitialState, action) => {
  switch (action.type) {
  case 'TOGGLE_GRAPH_TABLE_VIEW': {
    return {
      ...state,
      isGraphView: action.isGraphView,
      overlayPropertyHidden: true,
    };
  }
  case 'GRAPH_LAYOUT_CALCULATED': {
    return {
      ...state,
      nodes: action.nodes,
      edges: action.edges,
      graphBoundingBox: action.graphBoundingBox,
      layoutInitialized: true,
    };
  }
  case 'GRAPH_LEGEND_CALCULATED': {
    return {
      ...state,
      legendItems: action.legendItems,
    };
  }
  case 'GRAPH_UPDATE_HOVERING_NODE': {
    const newHoveringNode = state.nodes.find(n => n.id === action.nodeID);
    return {
      ...state,
      hoveringNode: newHoveringNode,
    };
  }
  case 'GRAPH_UPDATE_CANVAS_BOUNDING_RECT': {
    return {
      ...state,
      canvasBoundingRect: action.canvasBoundingRect,
    };
  }
  case 'GRAPH_UPDATE_RELATED_HIGHLIGHTING_NODE': {
    return {
      ...state,
      relatedNodeIDs: action.relatedNodeIDs,
    };
  }
  case 'GRAPH_UPDATE_SECOND_HIGHLIGHTING_NODE_CANDIDATES': {
    return {
      ...state,
      secondHighlightingNodeCandidateIDs: action.secondHighlightingNodeCandidateIDs,
    };
  }
  case 'GRAPH_UPDATE_PATH_RELATED_TO_SECOND_HIGHLIGHTING_NODE': {
    return {
      ...state,
      pathRelatedToSecondHighlightingNode: action.pathRelatedToSecondHighlightingNode,
    };
  }
  case 'GRAPH_UPDATE_DATA_MODEL_STRUCTURE': {
    return {
      ...state,
      dataModelStructure: action.dataModelStructure,
      dataModelStructureRelatedNodeIDs: action.dataModelStructureRelatedNodeIDs,
      dataModelStructureAllRoutesBetween: action.routesBetweenStartEndNodes,
    };
  }
  case 'GRAPH_SET_OVERLAY_PROPERTY_TABLE_HIDDEN': {
    return {
      ...state,
      overlayPropertyHidden: action.isHidden,
    };
  }
  case 'GRAPH_CANVAS_RESET_REQUIRED': {
    return {
      ...state,
      needReset: action.needReset,
    };
  }
  case 'GRAPH_RESET_HIGHLIGHT': {
    return {
      ...state,
      highlightingNode: null,
      secondHighlightingNodeID: null,
      tableExpandNodeID: null,
    };
  }
  case 'GRAPH_CLICK_NODE': {
    if (state.isSearchMode) {
      // clicking node in search mode opens property table
      return {
        ...state,
        highlightingMatchedNodeID: action.nodeID,
        highlightingMatchedNodeOpened: false,
        overlayPropertyHidden: false,
      };
    }
    let newHighlightingNode = null;
    let newSecondHighlightingNodeID = null;
    if (action.nodeID) {
      // if no node is selected, select this node as highlight node
      if (!state.highlightingNode) {
        newHighlightingNode = state.nodes.find(n => n.id === action.nodeID);
      } else if (state.highlightingNode) {
        newHighlightingNode = state.highlightingNode;

        // if is clicking the same node
        if (state.highlightingNode.id === action.nodeID) {
          // if no second node is selected, regard this as cancel selecting
          if (!state.secondHighlightingNodeID) {
            newHighlightingNode = null;
          }
        } else if (state.secondHighlightingNodeCandidateIDs.length > 1
          && state.secondHighlightingNodeCandidateIDs.includes(action.nodeID)) {
          // regard as canceling selecting second highlight node
          if (state.secondHighlightingNodeID === action.nodeID) {
            newSecondHighlightingNodeID = null;
          } else { // select this as second highlight node
            newSecondHighlightingNodeID = action.nodeID;
          }
        }
      }
    }
    const newTableExpandNodeID = newHighlightingNode ? newHighlightingNode.id : null;
    return {
      ...state,
      highlightingNode: newHighlightingNode,
      secondHighlightingNodeID: newSecondHighlightingNodeID,
      tableExpandNodeID: newTableExpandNodeID,
    };
  }
  case 'GRAPH_CLICK_BLANK_SPACE': {
    let newHighlightingNode = state.highlightingNode;
    let newSecondHighlightingNodeID = state.secondHighlightingNodeID;
    let newTableExpandNodeID = state.tableExpandNodeID;
    if (state.highlightingNode) {
      if (state.secondHighlightingNodeID) {
        newSecondHighlightingNodeID = null;
      } else {
        newHighlightingNode = null;
        newTableExpandNodeID = null;
      }
    }
    return {
      ...state,
      highlightingNode: newHighlightingNode,
      secondHighlightingNodeID: newSecondHighlightingNodeID,
      tableExpandNodeID: newTableExpandNodeID,
    };
  }
  case 'TABLE_EXPAND_NODE': {
    let newHighlightingNode = null;
    if (action.nodeID) {
      newHighlightingNode = state.nodes.find(n => n.id === action.nodeID);
    }
    return {
      ...state,
      tableExpandNodeID: action.nodeID,
      highlightingNode: newHighlightingNode,
      secondHighlightingNodeID: null,
    };
  }
  case 'SEARCH_SET_IS_SEARCHING_STATUS': {
    return {
      ...state,
      isSearching: action.isSearching,
    };
  }
  case 'SEARCH_RESULT_UPDATED': {
    return {
      ...state,
      searchResult: action.searchResult,
      matchedNodeIDs: action.searchResultSummary.generalMatchedNodeIDs,
      matchedNodeIDsInNameAndDescription:
        action.searchResultSummary.matchedNodeIDsInNameAndDescription,
      matchedNodeIDsInProperties: action.searchResultSummary.matchedNodeIDsInProperties,
      isGraphView: true,
      isSearchMode: true,
      highlightingMatchedNodeID: null,
      highlightingMatchedNodeOpened: false,
      highlightingNode: null,
      secondHighlightingNodeID: null,
      tableExpandNodeID: null,
    };
  }
  case 'SEARCH_CLEAR_HISTORY': {
    return {
      ...state,
      searchHistoryItems: clearSearchHistoryItems(),
    };
  }
  case 'SEARCH_HISTORY_ITEM_CREATED': {
    return {
      ...state,
      searchHistoryItems: addSearchHistoryItems(action.searchHistoryItem),
    };
  }
  case 'GRAPH_NODES_SVG_ELEMENTS_UPDATED': {
    return {
      ...state,
      graphNodesSVGElements: action.graphNodesSVGElements,
    };
  }
  case 'SEARCH_RESULT_CLEARED': {
    return {
      ...state,
      searchResult: [],
      matchedNodeIDs: [],
      currentSearchKeyword: '',
      isSearchMode: false,
      highlightingMatchedNodeID: null,
      highlightingMatchedNodeOpened: false,
    };
  }
  case 'SEARCH_SAVE_CURRENT_KEYWORD': {
    return {
      ...state,
      currentSearchKeyword: action.keyword,
    };
  }
  case 'GRAPH_MATCHED_NODE_OPENED': {
    return {
      ...state,
      highlightingMatchedNodeOpened: action.opened,
    };
  }
  default:
    return state;
  }
};

export default ddgraph;
