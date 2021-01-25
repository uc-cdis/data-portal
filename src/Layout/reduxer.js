import { connect } from 'react-redux';
import NavBar from '../components/layout/NavBar';
import TopBar from '../components/layout/TopBar';
import Footer from '../components/layout/Footer';
import dictIcons from '../img/icons/index';
import { logoutAPI } from '../actions';
import { components } from '../params';

export const ReduxNavBar = (() => {
  const mapStateToProps = (state) => ({
    navTitle: components.navigation.title,
    navItems: components.navigation.items,
    dictIcons,
    userAccess: state.userAccess.access,
  });

  return connect(mapStateToProps)(NavBar);
})();

export const ReduxTopBar = (() => {
  const mapStateToProps = (state) => ({
    navTitle: components.navigation.title,
    topItems: components.topBar.items,
    user: state.user,
    userAuthMapping: state.userAuthMapping,
  });

  // Bar chart does not dispatch anything
  const mapDispatchToProps = (dispatch) => ({
    onLogoutClick: () => dispatch(logoutAPI()),
  });

  return connect(mapStateToProps, mapDispatchToProps)(TopBar);
})();

export const ReduxFooter = (() => {
  const mapStateToProps = (state) => ({
    links: components.footer ? components.footer.links : [],
  });

  return connect(mapStateToProps)(Footer);
})();
