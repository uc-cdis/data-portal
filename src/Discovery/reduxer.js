import { connect } from 'react-redux';
import DiscoveryActionBar from './DiscoveryActionBar';

const ReduxDiscoveryActionBar = (() => {
  const mapStateToProps = (state, dispatch) => ({
    user: state.user,
    discovery: state.discovery,
    dispatch,
  });

  return connect(mapStateToProps)(DiscoveryActionBar);
})();

export default ReduxDiscoveryActionBar;
