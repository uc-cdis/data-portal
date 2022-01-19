import { connect } from 'react-redux';
import TopBar from '../components/layout/TopBar';
import { logoutAPI } from '../actions';

const resourcePath = '/services/sheepdog/submission/project';

/** @param {{ user: import('../types').UserState }} state */
const mapStateToProps = (state) => ({
  username: state.user.username,
  isAdminUser: state.user.authz?.[resourcePath]?.[0].method === '*',
});

const mapDispatchToProps = (dispatch) => ({
  onLogoutClick: () => dispatch(logoutAPI()),
});

const ReduxTopBar = connect(mapStateToProps, mapDispatchToProps)(TopBar);
export default ReduxTopBar;
