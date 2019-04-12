import { connect } from 'react-redux';
import NavBar from '../components/layout/NavBar';
import TopBar from '../components/layout/TopBar';
import Footer from '../components/layout/Footer';
import dictIcons from '../img/icons/index';
import { logoutAPI } from '../actions';
import { components } from '../params';
import { isPageFullScreen, isFooterHidden } from '../utils';
import { portalVersion } from '../versions';

export const setActive = link => ({
  type: 'ACTIVE_CHANGED',
  data: link,
});

export const initActive = link => ({
  type: 'ACTIVE_INIT',
  data: link,
});

export const ReduxNavBar = (() => {
  const mapStateToProps = state => ({
    navTitle: components.navigation.title,
    navItems: components.navigation.items,
    dictIcons,
    activeTab: state.bar.active,
    isFullWidth: isPageFullScreen(state.bar.active),
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
    navTitle: components.navigation.title,
    topItems: components.topBar.items,
    activeTab: state.bar.active,
    user: state.user,
    isFullWidth: isPageFullScreen(state.bar.active),
  });

  // Bar chart does not dispatch anything
  const mapDispatchToProps = dispatch => ({
    onActiveTab: link => dispatch(setActive(link)),
    onLogoutClick: () => dispatch(logoutAPI()),
  });

  return connect(mapStateToProps, mapDispatchToProps)(TopBar);
})();

export const ReduxFooter = (() => {
  const mapStateToProps = state => ({
    portalVersion,
    dictionaryVersion: state.versionInfo.dictionaryVersion,
    apiVersion: state.versionInfo.apiVersion,
    hidden: isFooterHidden(state.bar.active),
  });

  return connect(mapStateToProps)(Footer);
})();
