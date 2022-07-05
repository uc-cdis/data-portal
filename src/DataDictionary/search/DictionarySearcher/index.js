import { connect } from 'react-redux';
import {
  setIsSearching,
  setSearchResult,
  addSearchHistoryItem,
  clearSearchResult,
  saveCurrentSearchKeyword,
  resetGraphHighlight,
} from '../../../redux/ddgraph/slice';
import DictionarySearcher from './DictionarySearcher';

/** @typedef {import('../../../redux/types').RootState} RootState */
/** @typedef {import('../../types').SearchHistoryItem} SearchHistoryItem */

const ReduxDictionarySearcher = (() => {
  /** @param {RootState} state */
  const mapStateToProps = (state) => ({
    dictionary: state.submission.dictionary ?? {},
    currentSearchKeyword: state.ddgraph.currentSearchKeyword,
  });

  /** @param {import('redux').Dispatch} dispatch */
  const mapDispatchToProps = (dispatch) => ({
    /** @param {RootState['ddgraph']['isSearching']} isSearching */
    setIsSearching: (isSearching) => {
      dispatch(setIsSearching(isSearching));
    },
    /**
     * @param {RootState['ddgraph']['searchResult']} searchResult
     * @param {Object} searchResultSummary
     */
    onSearchResultUpdated: (searchResult, searchResultSummary) => {
      dispatch(setSearchResult({ searchResult, searchResultSummary }));
    },
    /** @param {SearchHistoryItem} searchHistoryItem */
    onSearchHistoryItemCreated: (searchHistoryItem) => {
      dispatch(addSearchHistoryItem(searchHistoryItem));
    },
    onSearchResultCleared: () => {
      dispatch(clearSearchResult());
    },
    /** @param {RootState['ddgraph']['currentSearchKeyword']} keyword */
    onSaveCurrentSearchKeyword: (keyword) => {
      dispatch(saveCurrentSearchKeyword(keyword));
    },
    onStartSearching: () => {
      dispatch(resetGraphHighlight());
    },
  });

  return connect(mapStateToProps, mapDispatchToProps, null, {
    forwardRef: true,
  })(DictionarySearcher);
})();

export default ReduxDictionarySearcher;
