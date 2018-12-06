import { connect } from 'react-redux';
import { setIsSearching, setSearchResult } from '../../action.js';
import DictionarySearcher from './DictionarySearcher';

const ReduxDictionarySearcher = (() => {
  const mapStateToProps = state => ({
    dictionary: state.submission.dictionary,
    isGraphView: state.ddgraph.isGraphView,
  });

  const mapDispatchToProps = dispatch => ({
    setIsSearching: isSearching => dispatch(setIsSearching(isSearching)),
    onSearchResultUpdated: result => dispatch(setSearchResult(result)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(DictionarySearcher);
})();

export default ReduxDictionarySearcher;
