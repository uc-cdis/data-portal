import { connect } from 'react-redux';
import TopBar from '../components/layout/TopBar';
import { logoutAPI } from '../redux/user/asyncThunks';

const resourcePath = '/services/sheepdog/submission/project';

/** @param {import('../redux/types').RootState} state */
const mapStateToProps = (state) => ({
  username: state.user.username,
  isAdminUser: state.user.authz?.[resourcePath]?.[0].method === '*',
});

/** @param {import('../redux/types').AppDispatch} dispatch */
const mapDispatchToProps = (dispatch) => ({
  onLogoutClick: () => dispatch(logoutAPI(false)),
});

const ReduxTopBar = connect(mapStateToProps, mapDispatchToProps)(TopBar);
export default ReduxTopBar;
