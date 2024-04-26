import { connect } from 'react-redux';
import DiscoveryActionBar from './DiscoveryActionBar/DiscoveryActionBar';
import DiscoveryDetails from './DiscoveryDetails/DiscoveryDetails';

export const ReduxDiscoveryActionBar = (() => {
  const mapStateToProps = (state) => ({
    user: state.user,
    discovery: state.discovery,
    systemPopupActivated: !!state.popups?.systemUseWarnPopup,
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
    systemPopupActivated: !!state.popups?.systemUseWarnPopup,
  });

  return connect(mapStateToProps)(DiscoveryDetails);
})();
