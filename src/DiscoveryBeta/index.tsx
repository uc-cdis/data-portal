import { connect } from 'react-redux';
import DiscoveryBeta from './DiscoveryBeta';

import { discoveryConfig } from '../localconf';

if (!discoveryConfig) {
  throw new Error('Could not find configuration for Discovery page. Check the portal config.');
}

const mapStateToProps = state => ({
  userAuthMapping: state.userAuthMapping,
  config: discoveryConfig,
});

export default connect(mapStateToProps)(DiscoveryBeta);
