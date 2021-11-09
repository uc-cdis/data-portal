import { connect } from 'react-redux';
import Footer from '../components/layout/Footer';

const mapStateToProps = (state) => state.versionInfo;
const ReduxFooter = connect(mapStateToProps)(Footer);
export default ReduxFooter;
