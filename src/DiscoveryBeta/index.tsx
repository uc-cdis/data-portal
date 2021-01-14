import { connect } from 'react-redux';
import DiscoveryBeta from './DiscoveryBeta';

const mapStateToProps = state => ({
    userAuthMapping: state.userAuthMapping
});

export default connect(mapStateToProps)(DiscoveryBeta);
