import { connect } from 'react-redux';
import NavBar from '../components/layout/NavBar';

/** @param {import('../redux/types').RootState} state */
const mapStateToProps = (state) => ({
  userAccess: state.userAccess,
});

const ReduxNavBar = connect(mapStateToProps)(NavBar);
export default ReduxNavBar;
