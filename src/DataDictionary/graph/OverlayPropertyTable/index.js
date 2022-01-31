import { connect } from 'react-redux';
import {
  setOverlayPropertyTableHidden,
  setHighlightingMatchedNodeOpened,
} from '../../action';
import OverlayPropertyTable from './OverlayPropertyTable';

/** @typedef {import('../../types').MatchedResult} MatchedResult */
/** @typedef {import('../../types').DdgraphState} DdgraphState */
/** @typedef {import('../../../Submission/types').SubmissionState} SubmissionState */

/** @param {{ ddgraph: DdgraphState; submission: SubmissionState }} state */
const getNode = (state) => {
  if (state.ddgraph.isSearchMode) {
    if (state.ddgraph.highlightingMatchedNodeID) {
      return state.submission.dictionary[
        state.ddgraph.highlightingMatchedNodeID
      ];
    }

    return null;
  }
  if (state.ddgraph.highlightingNode) {
    return state.submission.dictionary[state.ddgraph.highlightingNode.id];
  }
  return null;
};

/** @param {{ ddgraph: DdgraphState }} state */
const getSearchResultItem = (state) => {
  if (state.ddgraph.isSearchMode) {
    return state.ddgraph.searchResult.find(
      (resItem) => resItem.item.id === state.ddgraph.highlightingMatchedNodeID
    );
  }
  return null;
};

const ReduxOverlayPropertyTable = (() => {
  /** @param {{ ddgraph: DdgraphState; submission: SubmissionState }} state */
  const mapStateToProps = (state) => ({
    hidden: state.ddgraph.overlayPropertyHidden,
    isSearchMode: state.ddgraph.isSearchMode,
    isSearchResultNodeOpened: state.ddgraph.highlightingMatchedNodeOpened,
    matchedResult: getSearchResultItem(state),
    node: getNode(state),
  });

  /** @param {import('redux').Dispatch} dispatch */
  const mapDispatchToProps = (dispatch) => ({
    onCloseOverlayPropertyTable: () => {
      dispatch(setOverlayPropertyTableHidden(true));
    },
    onOpenMatchedProperties: () => {
      dispatch(setHighlightingMatchedNodeOpened(true));
    },
    onCloseMatchedProperties: () => {
      dispatch(setHighlightingMatchedNodeOpened(false));
    },
  });

  return connect(mapStateToProps, mapDispatchToProps)(OverlayPropertyTable);
})();

export default ReduxOverlayPropertyTable;
