import { connect } from 'react-redux';
import { clearSearchResult } from '../../action';
import ActionLayer from './ActionLayer';

const ReduxActionLayer = (() => {
  const mapStateToProps = state => ({
    isSearchMode: state.ddgraph.isSearchMode,
  });

  const mapDispatchToProps = dispatch => ({
    onClearSearch: () => dispatch(clearSearchResult()),
  });

  return connect(mapStateToProps, mapDispatchToProps)(ActionLayer);
})();

export default ReduxActionLayer;
