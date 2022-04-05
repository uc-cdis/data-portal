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

/** @typedef {import('../../types').DdgraphState} DdgraphState */
/** @typedef {import('../../types').MatchedResult} MatchedResult */
/** @typedef {import('../../types').SearchHistoryItem} SearchHistoryItem */
/** @typedef {import('../../../Submission/types').SubmissionState} SubmissionState */

const ReduxDictionarySearcher = (() => {
  /** @param {{ ddgraph: DdgraphState; submission: SubmissionState }} state */
  const mapStateToProps = (state) => ({
    dictionary: state.submission.dictionary ?? {},
    currentSearchKeyword: state.ddgraph.currentSearchKeyword,
  });

  /** @param {import('redux').Dispatch} dispatch */
  const mapDispatchToProps = (dispatch) => ({
    /** @param {DdgraphState['isSearching']} isSearching */
    setIsSearching: (isSearching) => {
      dispatch(setIsSearching(isSearching));
    },
    /**
     * @param {MatchedResult[]} result
     * @param {Object} summary
     */
    onSearchResultUpdated: (result, summary) => {
      dispatch(setSearchResult(result, summary));
    },
    /** @param {SearchHistoryItem} searchHistoryItem */
    onSearchHistoryItemCreated: (searchHistoryItem) => {
      dispatch(addSearchHistoryItem(searchHistoryItem));
    },
    onSearchResultCleared: () => {
      dispatch(clearSearchResult());
    },
    /** @param {DdgraphState['currentSearchKeyword']} keyword */
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
