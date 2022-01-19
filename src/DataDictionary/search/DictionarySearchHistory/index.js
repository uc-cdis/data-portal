import { connect } from 'react-redux';
import { clearSearchHistoryItems } from '../../action';
import DictionarySearchHistory from './DictionarySearchHistory';

const ReduxDictionarySearchHistory = (() => {
  /** @param {{ ddgraph: import('../../types').DdgraphState }} state */
  const mapStateToProps = (state) => ({
    searchHistoryItems: state.ddgraph.searchHistoryItems,
  });

  /** @param {import('redux').Dispatch} dispatch */
  const mapDispatchToProps = (dispatch) => ({
    onClearSearchHistoryItems: () => {
      dispatch(clearSearchHistoryItems());
    },
  });

  return connect(mapStateToProps, mapDispatchToProps)(DictionarySearchHistory);
})();

export default ReduxDictionarySearchHistory;
