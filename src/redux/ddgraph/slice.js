import { createSlice } from '@reduxjs/toolkit';
import {
  getSearchHistoryItems,
  clearSearchHistoryItems as _clearSearchHistoryItems,
  addSearchHistoryItems,
} from '../../DataDictionary/utils';
import { fetchGraphvizLayout } from './asyncThunks';

/**
 * @template T
 * @typedef {import('@reduxjs/toolkit').PayloadAction<T>} PayloadAction
 */
/** @typedef {import('./types').DdgraphState} DdgraphState */

/** @type {DdgraphState} */
const initialState = {
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

const slice = createSlice({
  name: 'ddgraph',
  initialState,
  reducers: {
    /** @param {PayloadAction<import('./types').SearchHistoryItem>} action */
    addSearchHistoryItem(state, action) {
      state.searchHistoryItems = addSearchHistoryItems(action.payload);
    },
    clearSearchHistoryItems(state) {
      state.searchHistoryItems = _clearSearchHistoryItems();
    },
    clearSearchResult(state) {
      state.searchResult = [];
      state.matchedNodeIDs = [];
      state.currentSearchKeyword = '';
      state.isSearchMode = false;
      state.highlightingMatchedNodeID = null;
      state.highlightingMatchedNodeOpened = false;
    },
    clickBlankSpace(state) {
      if (!state.highlightingNode) return;

      if (state.secondHighlightingNodeID) {
        state.secondHighlightingNodeID = null;
        return;
      }

      state.highlightingNode = null;
      state.tableExpandNodeID = null;
    },
    /** @param {PayloadAction<import('./types').GraphNode['id']>} action */
    clickNode(state, action) {
      const nodeID = action.payload;

      // if search mode, open property table
      if (state.isSearchMode) {
        state.highlightingMatchedNodeID = nodeID;
        state.highlightingMatchedNodeOpened = false;
        state.overlayPropertyHidden = false;
        return;
      }

      if (nodeID) {
        // if no node is selected, select this node
        if (!state.highlightingNode) {
          const newHighlightingNode = state.nodes.find((n) => n.id === nodeID);
          state.highlightingNode = newHighlightingNode;
          state.secondHighlightingNodeID = null;
          state.tableExpandNodeID = newHighlightingNode?.id ?? null;
          return;
        }

        // if clicking the same node
        if (state.highlightingNode.id === nodeID) {
          // if no second node is selected, unselect node
          const newHighlightingNode = state.secondHighlightingNodeID
            ? state.highlightingNode
            : null;
          state.highlightingNode = newHighlightingNode;
          state.secondHighlightingNodeID = null;
          state.tableExpandNodeID = state.highlightingNode?.id ?? null;
          return;
        }

        if (
          state.secondHighlightingNodeCandidateIDs.length > 1 &&
          state.secondHighlightingNodeCandidateIDs.includes(nodeID)
        ) {
          // if clicking the second node, unselect second node
          // otherwise select as second node
          state.secondHighlightingNodeID =
            state.secondHighlightingNodeID === nodeID ? null : nodeID;
          state.tableExpandNodeID = state.highlightingNode?.id ?? null;
          return;
        }
      }

      state.highlightingNode = null;
      state.secondHighlightingNodeID = null;
      state.tableExpandNodeID = null;
    },
    /** @param {PayloadAction<DdgraphState['hoveringNode']['id']>} action */
    hoverNode(state, action) {
      state.hoveringNode = state.nodes.find((n) => n.id === action.payload);
    },
    /** @param {PayloadAction<DdgraphState['graphvizLayout']>} action */
    receiveGraphvizLayout(state, action) {
      state.graphvizLayout = action.payload;
    },
    resetGraphHighlight(state) {
      state.highlightingNode = null;
      state.secondHighlightingNodeID = null;
      state.tableExpandNodeID = null;
    },
    /** @param {PayloadAction<DdgraphState['currentSearchKeyword']>} action */
    saveCurrentSearchKeyword(state, action) {
      state.currentSearchKeyword = action.payload;
    },
    /** @param {PayloadAction<DdgraphState['canvasBoundingRect']>} action */
    setCanvasBoundingRect(state, action) {
      state.canvasBoundingRect = action.payload;
    },
    /**
     * @typedef {Object} SetDataModelStructurePayload
     * @property {DdgraphState['dataModelStructure']} dataModelStructure
     * @property {DdgraphState['dataModelStructureRelatedNodeIDs']} dataModelStructureRelatedNodeIDs
     * @property {DdgraphState['routesBetweenStartEndNodes']} routesBetweenStartEndNodes
     */
    /** @param {PayloadAction<SetDataModelStructurePayload>} action */
    setDataModelStructure(state, action) {
      for (const [k, v] of Object.entries(action.payload)) {
        state[k] = v;
      }
    },
    /** @param {PayloadAction<import('./types').GraphNode['id']>} action */
    setExpandNode(state, action) {
      const nodeID = action.payload;
      const newHighlightingNode = nodeID
        ? state.nodes.find((n) => n.id === nodeID)
        : null;

      state.highlightingNode = newHighlightingNode;
      state.secondHighlightingNodeID = null;
      state.tableExpandNodeID = nodeID;
    },
    /** @param {PayloadAction<import('./types').GraphLayout>} action */
    setGraphLayout(state, action) {
      for (const [k, v] of Object.entries(action.payload)) {
        state[k] = v;
      }
      state.layoutInitialized = true;
    },
    /** @param {PayloadAction<DdgraphState['legendItems']>} action */
    setGraphLegend(state, action) {
      state.legendItems = action.payload;
    },
    /** @param {PayloadAction<DdgraphState['graphNodesSVGElements']>} action */
    setGraphNodesSVGElements(state, action) {
      // @ts-ignore
      state.graphNodesSVGElements = action.payload;
    },
    /** @param {PayloadAction<DdgraphState['isGraphView']>} action */
    setGraphView(state, action) {
      state.isGraphView = action.payload;
      state.overlayPropertyHidden = true;
    },
    /** @param {PayloadAction<DdgraphState['highlightingMatchedNodeOpened']>} action */
    setHighlightingMatchedNodeOpened(state, action) {
      state.highlightingMatchedNodeOpened = action.payload;
    },
    /** @param {PayloadAction<DdgraphState['isSearching']>} action */
    setIsSearching(state, action) {
      state.isSearching = action.payload;
    },
    /** @param {PayloadAction<DdgraphState['needReset']>} action */
    setNeedReset(state, action) {
      state.needReset = action.payload;
    },
    /** @param {PayloadAction<DdgraphState['overlayPropertyHidden']>} action */
    setOverlayPropertyTableHidden(state, action) {
      state.overlayPropertyHidden = action.payload;
    },
    /** @param {PayloadAction<DdgraphState['pathRelatedToSecondHighlightingNode']>} action */
    setPathRelatedToSecondHighlightingNode(state, action) {
      state.pathRelatedToSecondHighlightingNode = action.payload;
    },
    /** @param {PayloadAction<DdgraphState['relatedNodeIDs']>} action */
    setRelatedNodeIDs(state, action) {
      state.relatedNodeIDs = action.payload;
    },
    /**
     * @typedef {Object} SetSearchResaultPayload
     * @property {DdgraphState['searchResult']} searchResult
     * @property {Object} searchResultSummary
     * @property {DdgraphState['matchedNodeIDs']} searchResultSummary.generalMatchedNodeIDs
     * @property {DdgraphState['matchedNodeIDsInNameAndDescription']} searchResultSummary.matchedNodeIDsInNameAndDescription
     * @property {DdgraphState['matchedNodeIDsInProperties']} searchResultSummary.matchedNodeIDsInProperties
     */
    /** @param {PayloadAction<SetSearchResaultPayload>} action */
    setSearchResult(state, action) {
      const { searchResult } = action.payload;
      state.searchResult = searchResult;

      const { searchResultSummary } = action.payload;
      state.matchedNodeIDs = searchResultSummary.generalMatchedNodeIDs;
      state.matchedNodeIDsInNameAndDescription =
        searchResultSummary.matchedNodeIDsInNameAndDescription;
      state.matchedNodeIDsInProperties =
        searchResultSummary.matchedNodeIDsInProperties;

      state.isGraphView = true;
      state.isSearchMode = true;
      state.highlightingMatchedNodeID = null;
      state.highlightingMatchedNodeOpened = false;
      state.highlightingNode = null;
      state.secondHighlightingNodeID = null;
      state.tableExpandNodeID = null;
    },
    /** @param {PayloadAction<DdgraphState['secondHighlightingNodeCandidateIDs']>} action */
    setSecondHighlightingNodeCandidateIDs(state, action) {
      state.secondHighlightingNodeCandidateIDs = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGraphvizLayout.fulfilled, (state, action) => {
      if (action.payload !== null) state.graphvizLayout = action.payload;
    });
  },
});

export const {
  addSearchHistoryItem,
  clearSearchHistoryItems,
  clearSearchResult,
  clickBlankSpace,
  clickNode,
  hoverNode,
  receiveGraphvizLayout,
  resetGraphHighlight,
  saveCurrentSearchKeyword,
  setCanvasBoundingRect,
  setDataModelStructure,
  setExpandNode,
  setGraphLayout,
  setGraphLegend,
  setGraphNodesSVGElements,
  setGraphView,
  setHighlightingMatchedNodeOpened,
  setIsSearching,
  setNeedReset,
  setOverlayPropertyTableHidden,
  setPathRelatedToSecondHighlightingNode,
  setRelatedNodeIDs,
  setSearchResult,
  setSecondHighlightingNodeCandidateIDs,
} = slice.actions;

export default slice.reducer;
