import { connect } from 'react-redux';
import DiscoveryActionBar from './DiscoveryActionBar';

const ReduxDiscoveryActionBar = (() => {
  const mapStateToProps = (state) => ({
    user: state.user,
  });

  return connect(mapStateToProps)(DiscoveryActionBar);
})();

export default ReduxDiscoveryActionBar;
