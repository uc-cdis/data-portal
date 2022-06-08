import {
  getSearchHistoryItems,
  clearSearchHistoryItems,
  addSearchHistoryItems,
} from './utils';

/** @typedef {import('./types').DdgraphState} DdgraphState */

/** @type {DdgraphState} */
const ddgraphInitialState = {
  isGraphView: false,
  layoutInitialized: false,
  nodes: [],
  edges: [],
  graphBoundingBox: [],
  graphvizLayout: null,
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

/** @type {import('redux').Reducer<DdgraphState>} */
const ddgraph = (state = ddgraphInitialState, action) => {
  switch (action.type) {
    case 'RECEIVE_GRAPHVIZ_LAYOUT': {
      return { ...state, graphvizLayout: action.payload };
    }
    case 'TOGGLE_GRAPH_TABLE_VIEW': {
      return {
        ...state,
        isGraphView: action.payload,
        overlayPropertyHidden: true,
      };
    }
    case 'GRAPH_LAYOUT_CALCULATED': {
      return {
        ...state,
        ...action.payload,
        layoutInitialized: true,
      };
    }
    case 'GRAPH_LEGEND_CALCULATED': {
      return { ...state, legendItems: action.payload };
    }
    case 'GRAPH_UPDATE_HOVERING_NODE': {
      const newHoveringNode = state.nodes.find((n) => n.id === action.payload);
      return {
        ...state,
        hoveringNode: newHoveringNode,
      };
    }
    case 'GRAPH_UPDATE_CANVAS_BOUNDING_RECT': {
      return { ...state, canvasBoundingRect: action.payload };
    }
    case 'GRAPH_UPDATE_RELATED_HIGHLIGHTING_NODE': {
      return { ...state, relatedNodeIDs: action.payload };
    }
    case 'GRAPH_UPDATE_SECOND_HIGHLIGHTING_NODE_CANDIDATES': {
      return { ...state, secondHighlightingNodeCandidateIDs: action.payload };
    }
    case 'GRAPH_UPDATE_PATH_RELATED_TO_SECOND_HIGHLIGHTING_NODE': {
      return { ...state, pathRelatedToSecondHighlightingNode: action.payload };
    }
    case 'GRAPH_UPDATE_DATA_MODEL_STRUCTURE': {
      return { ...state, ...action.payload };
    }
    case 'GRAPH_SET_OVERLAY_PROPERTY_TABLE_HIDDEN': {
      return { ...state, overlayPropertyHidden: action.payload };
    }
    case 'GRAPH_CANVAS_RESET_REQUIRED': {
      return { ...state, needReset: action.payload };
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
      const nodeID = action.payload;
      if (state.isSearchMode) {
        // clicking node in search mode opens property table
        return {
          ...state,
          highlightingMatchedNodeID: nodeID,
          highlightingMatchedNodeOpened: false,
          overlayPropertyHidden: false,
        };
      }
      let newHighlightingNode = null;
      let newSecondHighlightingNodeID = null;
      if (nodeID) {
        // if no node is selected, select this node as highlight node
        if (!state.highlightingNode) {
          newHighlightingNode = state.nodes.find((n) => n.id === nodeID);
        } else if (state.highlightingNode) {
          newHighlightingNode = state.highlightingNode;

          // if is clicking the same node
          if (state.highlightingNode.id === nodeID) {
            // if no second node is selected, regard this as cancel selecting
            if (!state.secondHighlightingNodeID) {
              newHighlightingNode = null;
            }
          } else if (
            state.secondHighlightingNodeCandidateIDs.length > 1 &&
            state.secondHighlightingNodeCandidateIDs.includes(nodeID)
          ) {
            // regard as canceling selecting second highlight node
            if (state.secondHighlightingNodeID === nodeID) {
              newSecondHighlightingNodeID = null;
            } else {
              // select this as second highlight node
              newSecondHighlightingNodeID = nodeID;
            }
          }
        }
      }
      const newTableExpandNodeID = newHighlightingNode
        ? newHighlightingNode.id
        : null;
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
      const nodeID = action.payload;
      let newHighlightingNode = null;
      if (nodeID) {
        newHighlightingNode = state.nodes.find((n) => n.id === nodeID);
      }
      return {
        ...state,
        tableExpandNodeID: nodeID,
        highlightingNode: newHighlightingNode,
        secondHighlightingNodeID: null,
      };
    }
    case 'SEARCH_SET_IS_SEARCHING_STATUS': {
      return {
        ...state,
        isSearching: action.payload,
      };
    }
    case 'SEARCH_RESULT_UPDATED': {
      const { searchResult, searchResultSummary } = action.payload;
      return {
        ...state,
        searchResult,
        matchedNodeIDs: searchResultSummary.generalMatchedNodeIDs,
        matchedNodeIDsInNameAndDescription:
          searchResultSummary.matchedNodeIDsInNameAndDescription,
        matchedNodeIDsInProperties:
          searchResultSummary.matchedNodeIDsInProperties,
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
      return { ...state, searchHistoryItems: clearSearchHistoryItems() };
    }
    case 'SEARCH_HISTORY_ITEM_CREATED': {
      return {
        ...state,
        searchHistoryItems: addSearchHistoryItems(action.payload),
      };
    }
    case 'GRAPH_NODES_SVG_ELEMENTS_UPDATED': {
      return { ...state, graphNodesSVGElements: action.payload };
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
      return { ...state, currentSearchKeyword: action.payload };
    }
    case 'GRAPH_MATCHED_NODE_OPENED': {
      return { ...state, highlightingMatchedNodeOpened: action.payload };
    }
    default:
      return state;
  }
};

export default ddgraph;
