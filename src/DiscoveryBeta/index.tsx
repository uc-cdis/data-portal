import { connect } from 'react-redux';
import DiscoveryBeta from './DiscoveryBeta';

// DEV ONLY
import mockConfig from './mock_config.json';

const mapStateToProps = state => ({
  userAuthMapping: state.userAuthMapping,
  config: mockConfig,
});

export default connect(mapStateToProps)(DiscoveryBeta);
