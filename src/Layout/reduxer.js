import { connect } from 'react-redux';
import NavBar from '../components/layout/NavBar';
import TopBar from '../components/layout/TopBar';
import { logoutAPI } from '../actions';

export const ReduxNavBar = (() => {
  const mapStateToProps = (state) => ({
    userAccess: state.userAccess.access,
  });

  return connect(mapStateToProps)(NavBar);
})();

export const ReduxTopBar = (() => {
  const resourcePath = '/services/sheepdog/submission/project';

  const mapStateToProps = (state) => ({
    username: state.user.username,
    isAdminUser: state.user.authz?.[resourcePath]?.[0].method === '*',
  });

  // Bar chart does not dispatch anything
  const mapDispatchToProps = (dispatch) => ({
    onLogoutClick: () => dispatch(logoutAPI()),
  });

  return connect(mapStateToProps, mapDispatchToProps)(TopBar);
})();
