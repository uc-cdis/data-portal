import { connect } from 'react-redux';
import {
  setOverlayPropertyTableHidden,
  setHighlightingMatchedNodeOpened,
} from '../../action';
import OverlayPropertyTable from './OverlayPropertyTable';

const getNode = (state) => {
  if (state.ddgraph.isSearchMode) {
    if (state.ddgraph.highlightingMatchedNodeID) {
      return state.submission.dictionary[state.ddgraph.highlightingMatchedNodeID];
    }

    return null;
  }
  if (state.ddgraph.highlightingNode) {
    return state.submission.dictionary[state.ddgraph.highlightingNode.id];
  }
  return null;
};

const getSearchResultItem = (state) => {
  if (state.ddgraph.isSearchMode) {
    return state.ddgraph.searchResult
      .find(resItem => resItem.item.id === state.ddgraph.highlightingMatchedNodeID);
  }
  return null;
};

const ReduxOverlayPropertyTable = (() => {
  const mapStateToProps = state => ({
    hidden: state.ddgraph.overlayPropertyHidden,
    node: getNode(state),
    isSearchMode: state.ddgraph.isSearchMode,
    matchedResult: getSearchResultItem(state),
    isSearchResultNodeOpened: state.ddgraph.highlightingMatchedNodeOpened,
  });

  const mapDispatchToProps = dispatch => ({
    onCloseOverlayPropertyTable: () => dispatch(setOverlayPropertyTableHidden(true)),
    onOpenMatchedProperties: () => dispatch(setHighlightingMatchedNodeOpened(true)),
    onCloseMatchedProperties: () => dispatch(setHighlightingMatchedNodeOpened(false)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(OverlayPropertyTable);
})();

export default ReduxOverlayPropertyTable;
