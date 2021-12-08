import { connect } from 'react-redux';
import DiscoveryActionBar from './DiscoveryActionBar';

const ReduxDiscoveryActionBar = (() => {
  const mapStateToProps = (state) => ({
    user: state.user,
    discovery: state.discovery,
  });

  const mapDispatchToProps = (dispatch) => ({
    onActionResumed: () => dispatch({ type: 'REDIRECT_ACTION_RESUMED' }),
  });

  return connect(mapStateToProps, mapDispatchToProps)(DiscoveryActionBar);
})();

export default ReduxDiscoveryActionBar;
