import { connect } from 'react-redux';
import Footer from '../components/layout/Footer';

const mapStateToProps = (state) => ({
  dataVersion: state.versionInfo.dataVersion,
});

const ReduxFooter = connect(mapStateToProps)(Footer);
export default ReduxFooter;
