import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import { components } from '../params';
import dictIcons from '../img/icons/index';
import ReduxFooter from './ReduxFooter';
import ScreenSizeWarning from '../components/ScreenSizeWarning';
import ReduxTopBar from './ReduxTopBar';
import ReduxNavBar from './ReduxNavBar';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
function Layout({ children }) {
  const isFooterHidden = useRouteMatch('/dd')?.isExact;

  return (
    <>
      <header>
        <ReduxTopBar topItems={components.topBar.items} />
        <ReduxNavBar
          dictIcons={dictIcons}
          navItems={components.navigation.items}
          navTitle={components.navigation.title}
        />
      </header>
      <main>{children}</main>
      {isFooterHidden || (
        <ReduxFooter
          links={components.footer?.links}
          logos={components.footerLogos}
          privacyPolicy={components.privacyPolicy}
        />
      )}
      <ScreenSizeWarning />
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default Layout;
