import { connect } from 'react-redux';
import DiscoveryActionBar from './DiscoveryActionBar';

const ReduxDiscoveryActionBar = (() => {
  const mapStateToProps = (state, dispatch) => {
    // console.log("mapping state to props", state);
    return {
    user: state.user,
    discovery: state.discovery,
    dispatch
  }};

  return connect(mapStateToProps)(DiscoveryActionBar);
})();

export default ReduxDiscoveryActionBar;
