/**
 * Workspace portal entry point.
 * Workspace portal just deploys workspaces and identity
 */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import 'react-select/dist/react-select.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import ReactGA from 'react-ga';
import { Helmet } from 'react-helmet';

import 'antd/dist/antd.css';
import '@gen3/ui-component/dist/css/base.less';
import { fetchUserAccess, fetchUserAuthMapping } from './actions';
import ProtectedContent from './Login/ProtectedContent';
import UserProfile, { fetchAccess } from './UserProfile/ReduxUserProfile';
import theme from './theme';
import getReduxStore from './reduxStore';
import ReduxLogin, { fetchLogin } from './Login/ReduxLogin';
import { ReduxNavBar, ReduxTopBar, ReduxFooter } from './Layout/reduxer';
import { basename, dev, gaDebug } from './localconf';
import { gaTracking, components } from './params';
import GA, { RouteTracker } from './components/GoogleAnalytics';
import isEnabled from './helpers/featureFlags';
import sessionMonitor from './SessionMonitor';
import Workspace from './Workspace';
import './index.less';


// monitor user's session
sessionMonitor.start();

// render the app after the store is configured
async function init() {
  const store = await getReduxStore();

  // asyncSetInterval(() => store.dispatch(fetchUser), 60000);
  ReactGA.initialize(gaTracking);
  ReactGA.pageview(window.location.pathname + window.location.search);
  // FontAwesome icons
  library.add(faAngleUp, faAngleDown);

  await Promise.all(
    [
      // resources can be open to anonymous users, so fetch access:
      store.dispatch(fetchUserAccess),
      store.dispatch(fetchUserAuthMapping),
    ],
  );

  render(
    <div>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter basename={basename}>
            <div>
              {GA.init(gaTracking, dev, gaDebug) && <RouteTracker />}
              {isEnabled('noIndex') ?
                <Helmet>
                  <meta name='robots' content='noindex,nofollow' />
                </Helmet>
                : null
              }
              <ReduxTopBar />
              <ReduxNavBar />
              <div className='main-content'>
                <Switch>
                  {/* process with trailing and duplicate slashes first */}
                  {/* see https://github.com/ReactTraining/react-router/issues/4841#issuecomment-523625186 */}
                  {/* Removes trailing slashes */}
                  <Route
                    path='/:url*(/+)'
                    exact
                    strict
                    render={({ location }) => (
                      <Redirect to={location.pathname.replace(/\/+$/, '')} />
                    )}
                  />
                  {/* Removes duplicate slashes in the middle of the URL */}
                  <Route
                    path='/:url(.*//+.*)'
                    exact
                    strict
                    render={({ match }) => (
                      <Redirect to={`/${match.params.url.replace(/\/\/+/, '/')}`} />
                    )}
                  />
                  <Route
                    exact
                    path='/login'
                    component={
                      (
                        props => (
                          <ProtectedContent
                            public
                            filter={() => store.dispatch(fetchLogin())}
                            component={ReduxLogin}
                            {...props}
                          />
                        )
                      )
                    }
                  />
                  <Route
                    exact
                    path='/identity'
                    component={
                      props => (<ProtectedContent
                        filter={() => store.dispatch(fetchAccess())}
                        component={UserProfile}
                        {...props}
                      />)
                    }
                  />
                  <Route
                    exact
                    path='/workspace'
                    component={
                      props => <ProtectedContent component={Workspace} {...props} />
                    }
                  />
                  <Route
                    path='*'
                    render={
                      () => (
                        <Redirect to='/workspace' />
                      )
                    }
                  />
                </Switch>
              </div>
              <ReduxFooter
                logos={components.footerLogos}
                privacyPolicy={components.privacyPolicy}
              />
            </div>
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </div>,
    document.getElementById('root'),
  );
}

init();
