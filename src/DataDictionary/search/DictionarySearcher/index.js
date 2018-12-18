import { connect } from 'react-redux';
import {
  setIsSearching,
  setSearchResult,
  addSearchHistoryItem,
  clearSearchResult,
  collapseAllMatchedNodePopups,
  expandAllMAtchedNodePopups,
  saveCurrentSearchKeyword,
  setHighlightingNode,
} from '../../action';
import DictionarySearcher from './DictionarySearcher';

const ReduxDictionarySearcher = (() => {
  const mapStateToProps = state => ({
    dictionary: state.submission.dictionary,
    isGraphView: state.ddgraph.isGraphView,
    matchedNodeExpandingStatus: state.ddgraph.matchedNodeExpandingStatus,
    currentSearchKeyword: state.ddgraph.currentSearchKeyword,
  });

  const mapDispatchToProps = dispatch => ({
    setIsSearching: isSearching => dispatch(setIsSearching(isSearching)),
    onSearchResultUpdated: result => dispatch(setSearchResult(result)),
    onSearchHistoryItemCreated: searchHistoryItem =>
      dispatch(addSearchHistoryItem(searchHistoryItem)),
    onSearchResultCleared: () => dispatch(clearSearchResult()),
    onCollapseAllMatchedNodePopups: () => dispatch(collapseAllMatchedNodePopups()),
    onExpandAllMatchedNodePopups: () => dispatch(expandAllMAtchedNodePopups()),
    onSaveCurrentSearchKeyword: keyword => dispatch(saveCurrentSearchKeyword(keyword)),
    onStartSearching: () => dispatch(setHighlightingNode()),
  });

  return connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(DictionarySearcher);
})();

export default ReduxDictionarySearcher;
