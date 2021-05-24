import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import { components } from '../params';
import dictIcons from '../img/icons/index';
import Footer from '../components/layout/Footer';
import { ReduxTopBar, ReduxNavBar } from './reduxer';

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
        <Footer
          links={components.footer?.links}
          logos={components.footerLogos}
          privacyPolicy={components.privacyPolicy}
        />
      )}
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
