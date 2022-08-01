import { connect } from 'react-redux';
import { clearSearchHistoryItems } from '../../../redux/ddgraph/slice';
import DictionarySearchHistory from './DictionarySearchHistory';

const ReduxDictionarySearchHistory = (() => {
  /** @param {import('../../../redux/types').RootState} state */
  const mapStateToProps = (state) => ({
    searchHistoryItems: state.ddgraph.searchHistoryItems,
  });

  /** @param {import('../../../redux/types').AppDispatch} dispatch */
  const mapDispatchToProps = (dispatch) => ({
    onClearSearchHistoryItems: () => {
      dispatch(clearSearchHistoryItems());
    },
  });

  return connect(mapStateToProps, mapDispatchToProps)(DictionarySearchHistory);
})();

export default ReduxDictionarySearchHistory;
