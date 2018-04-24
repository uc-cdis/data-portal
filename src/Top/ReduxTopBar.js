import { connect } from 'react-redux';
import { logoutAPI } from '../actions';
import { topItems } from '../localconf';
import TopBar from '../components/TopBar';
import dictIcons from '../img/icons/index';

const mapStateToProps = state => ({ dictIcons, user: state.user, topItems });

const mapDispatchToProps = dispatch => ({
  onLogoutClick: () => dispatch(logoutAPI()),
});
const ReduxTopBar = connect(mapStateToProps, mapDispatchToProps)(TopBar);
export default ReduxTopBar;