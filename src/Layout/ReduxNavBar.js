import { connect } from 'react-redux';
import NavBar from '../components/layout/NavBar';

/** @param {{ userAccess: import('../types').UserAccessState }} state */
const mapStateToProps = (state) => ({
  userAccess: state.userAccess.access,
});

const ReduxNavBar = connect(mapStateToProps)(NavBar);
export default ReduxNavBar;
