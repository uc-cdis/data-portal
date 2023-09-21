import { connect } from 'react-redux';
import DiscoveryActionBar from './DiscoveryActionBar';
import DiscoveryDetails from './DiscoveryDetails/DiscoveryDetails';

export const ReduxDiscoveryActionBar = (() => {
  const mapStateToProps = (state) => ({
    user: state.user,
    discovery: state.discovery,
  });

  const mapDispatchToProps = (dispatch) => ({
    onActionResumed: () => dispatch({ type: 'REDIRECT_ACTION_RESUMED' }),
  });

  return connect(mapStateToProps, mapDispatchToProps)(DiscoveryActionBar);
})();

export const ReduxDiscoveryDetails = (() => {
  const mapStateToProps = (state) => ({
    user: state.user,
    userAuthMapping: state.userAuthMapping,
  });

  return connect(mapStateToProps)(DiscoveryDetails);
})();
