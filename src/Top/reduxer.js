import { connect } from 'react-redux';
import { navBar, navItems, topItems } from '../localconf';
import NavBar from '../components/layout/NavBar';
import TopBar from '../components/layout/TopBar';
import dictIcons from '../img/icons/index';
import { logoutAPI } from '../actions';

export const setActive = (link) => {
  console.log(`active link ${link}`);
  return {
    type: 'ACTIVE_CHANGED',
    data: link,
  };
};

export const initActive = link => ({
  type: 'ACTIVE_INIT',
  data: link,
});

export const ReduxNavBar = (() => {
  const mapStateToProps = state => ({
    navTitle: navBar.title,
    navItems,
    dictIcons,
    activeTab: state.bar.active,
  });

  // Bar chart does not dispatch anything
  const mapDispatchToProps = dispatch => ({
    onActiveTab: link => dispatch(setActive(link)),
    onInitActive: () => dispatch(initActive()),
  });

  return connect(mapStateToProps, mapDispatchToProps)(NavBar);
})();

export const ReduxTopBar = (() => {
  const mapStateToProps = state => ({
    navTitle: navBar.title,
    topItems,
    dictIcons,
    activeTab: state.bar.active,
    user: state.user,
  });

  // Bar chart does not dispatch anything
  const mapDispatchToProps = dispatch => ({
    onActiveTab: link => dispatch(setActive(link)),
    onLogoutClick: () => dispatch(logoutAPI()),
  });

  return connect(mapStateToProps, mapDispatchToProps)(TopBar);
})();
