import { connect } from 'react-redux';
import ActionLayer from './ActionLayer';

const ReduxActionLayer = (() => {
  const mapStateToProps = state => ({
    isSearchMode: state.ddgraph.isSearchMode,
  });

  return connect(mapStateToProps)(ActionLayer);
})();

export default ReduxActionLayer;
