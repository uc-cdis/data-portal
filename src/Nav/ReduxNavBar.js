import { connect } from 'react-redux';

import { logoutAPI } from '../actions';
import { navItems } from '../localconf';
import NavBar from '../components/NavBar';

const mapStateToProps = state => ({ user: state.user, navItems });

const mapDispatchToProps = dispatch => ({
  onLogoutClick: () => dispatch(logoutAPI()),
});
const ReduxNavBar = connect(mapStateToProps, mapDispatchToProps)(NavBar);
export default ReduxNavBar;
