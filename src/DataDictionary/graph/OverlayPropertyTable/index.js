import { connect } from 'react-redux';
import {
  setOverlayPropertyTableHidden,
  setHighlightingMatchedNodeOpened,
} from '../../../redux/ddgraph/slice';
import OverlayPropertyTable from './OverlayPropertyTable';

/** @typedef {import('../../../redux/types').RootState} RootState */

/** @param {RootState} state */
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

/** @param {RootState} state */
const getSearchResultItem = (state) => {
  if (state.ddgraph.isSearchMode) {
    return state.ddgraph.searchResult.find(
      (resItem) => resItem.item.id === state.ddgraph.highlightingMatchedNodeID
    );
  }
  return null;
};

const ReduxOverlayPropertyTable = (() => {
  /** @param {RootState} state */
  const mapStateToProps = (state) => ({
    hidden: state.ddgraph.overlayPropertyHidden,
    isSearchMode: state.ddgraph.isSearchMode,
    isSearchResultNodeOpened: state.ddgraph.highlightingMatchedNodeOpened,
    matchedResult: getSearchResultItem(state),
    node: getNode(state),
  });

  /** @param {import('../../../redux/types').AppDispatch} dispatch */
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
