import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { components } from '../params';
import isEnabled from '../helpers/featureFlags';
import dictIcons from '../img/icons/index';
import ReduxFooter from './ReduxFooter';
import ScreenSizeWarning from '../components/ScreenSizeWarning';
import ReduxTopBar from './ReduxTopBar';
import ReduxNavBar from './ReduxNavBar';
import './Layout.css';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
function Layout({ children }) {
  const location = useLocation();

  const isDashboardPage =
    location.pathname.toLowerCase().startsWith('/dd') ||
    location.pathname.toLowerCase().startsWith('/explorer');

  return (
    <>
      {isEnabled('noIndex') && (
        <Helmet>
          <meta name='robots' content='noindex,nofollow' />
        </Helmet>
      )}
      <header>
        <ReduxTopBar config={components.topBar} />
        <ReduxNavBar
          dictIcons={dictIcons}
          navItems={components.navigation.items}
          navTitle={components.navigation.title}
        />
      </header>
      <main className='main'>{children}</main>
      {isDashboardPage || (
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
