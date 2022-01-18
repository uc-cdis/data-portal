import { connect } from 'react-redux';
import Footer from '../components/layout/Footer';

/** @param {{ versionInfo: import('../types').VersionInfoState }} state */
const mapStateToProps = (state) => state.versionInfo;
const ReduxFooter = connect(mapStateToProps)(Footer);
export default ReduxFooter;
