import { connect } from 'react-redux';
import {
  setIsSearching,
  setSearchResult,
  addSearchHistoryItem,
  clearSearchResult,
  saveCurrentSearchKeyword,
  resetGraphHighlight,
} from '../../action';
import DictionarySearcher from './DictionarySearcher';

const ReduxDictionarySearcher = (() => {
  const mapStateToProps = state => ({
    dictionary: state.submission.dictionary,
    currentSearchKeyword: state.ddgraph.currentSearchKeyword,
  });

  const mapDispatchToProps = dispatch => ({
    setIsSearching: isSearching => dispatch(setIsSearching(isSearching)),
    onSearchResultUpdated: (result, summary) => dispatch(setSearchResult(result, summary)),
    onSearchHistoryItemCreated: searchHistoryItem =>
      dispatch(addSearchHistoryItem(searchHistoryItem)),
    onSearchResultCleared: () => dispatch(clearSearchResult()),
    onSaveCurrentSearchKeyword: keyword => dispatch(saveCurrentSearchKeyword(keyword)),
    onStartSearching: () => dispatch(resetGraphHighlight()),
  });

  return connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(DictionarySearcher);
})();

export default ReduxDictionarySearcher;
