import { connect } from 'react-redux';
import { setIsSearching, setSearchResult, addSearchHistoryItem, clearSearchResult } from '../../action';
import DictionarySearcher from './DictionarySearcher';

const ReduxDictionarySearcher = (() => {
  const mapStateToProps = state => ({
    dictionary: state.submission.dictionary,
    isGraphView: state.ddgraph.isGraphView,
  });

  const mapDispatchToProps = dispatch => ({
    setIsSearching: isSearching => dispatch(setIsSearching(isSearching)),
    onSearchResultUpdated: result => dispatch(setSearchResult(result)),
    onSearchHistoryItemCreated: searchHistoryItem =>
      dispatch(addSearchHistoryItem(searchHistoryItem)),
    onSearchResultCleared: () => dispatch(clearSearchResult()),
  });

  return connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(DictionarySearcher);
})();

export default ReduxDictionarySearcher;
