import { connect } from 'react-redux';
import GWASUIApp from './GWASUIApp';

const mapStateToProps = (state) => ({
  userAuthMapping: state.userAuthMapping,
});

const ReduxGWASUIApp = connect(mapStateToProps)(GWASUIApp);
export default ReduxGWASUIApp;
