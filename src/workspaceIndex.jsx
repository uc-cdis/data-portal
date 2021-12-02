/**
 * Workspace portal entry point.
 * Workspace portal just deploys workspaces and identity
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import {
  BrowserRouter, Route, Switch, Redirect,
} from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import ReactGA from 'react-ga';
import { Helmet } from 'react-helmet';
import { datadogRum } from '@datadog/browser-rum';

import 'antd/dist/antd.css';
import '@gen3/ui-component/dist/css/base.less';
import { fetchAndSetCsrfToken } from './configs';
import { fetchUserAccess, fetchUserAuthMapping, updateSystemUseNotice } from './actions';
import ProtectedContent from './Login/ProtectedContent';
import UserProfile, { fetchAccess } from './UserProfile/ReduxUserProfile';
import theme from './theme';
import getReduxStore from './reduxStore';
import ReduxLogin, { fetchLogin } from './Login/ReduxLogin';
import { ReduxNavBar, ReduxTopBar, ReduxFooter } from './Layout/reduxer';
import {
  basename, dev, gaDebug, workspaceUrl, workspaceErrorUrl, enableDAPTracker,
  ddApplicationId, ddClientToken, ddEnv, ddSampleRate,
} from './localconf';
import { portalVersion } from './versions';
import { gaTracking, components } from './params';
import GA, { RouteTracker } from './components/GoogleAnalytics';
import { DAPRouteTracker } from './components/DAPAnalytics';
import isEnabled from './helpers/featureFlags';
import sessionMonitor from './SessionMonitor';
import workspaceSessionMonitor from './Workspace/WorkspaceSessionMonitor';
import Workspace from './Workspace';
import ReduxWorkspaceShutdownPopup from './Popup/ReduxWorkspaceShutdownPopup';
import ReduxWorkspaceShutdownBanner from './Popup/ReduxWorkspaceShutdownBanner';
import ErrorWorkspacePlaceholder from './Workspace/ErrorWorkspacePlaceholder';

// monitor user's session
sessionMonitor.start();
workspaceSessionMonitor.start();

// render the app after the store is configured
async function init() {
  const store = await getReduxStore();

  ReactGA.initialize(gaTracking);
  ReactGA.pageview(window.location.pathname + window.location.search);

  // Datadog setup
  if (ddApplicationId && !ddClientToken) {
    console.warn('Datadog applicationId is set, but clientToken is missing');
  } else if (!ddApplicationId && ddClientToken) {
    console.warn('Datadog clientToken is set, but applicationId is missing');
  } else if (ddApplicationId && ddClientToken) {
    datadogRum.init({
      applicationId: ddApplicationId,
      clientToken: ddClientToken,
      site: 'datadoghq.com',
      service: 'portal',
      env: ddEnv,
      version: portalVersion,
      sampleRate: ddSampleRate,
      trackInteractions: true,
    });
  }

  // FontAwesome icons
  library.add(faAngleUp, faAngleDown);

  await Promise.all(
    [
      // resources can be open to anonymous users, so fetch access:
      store.dispatch(fetchUserAccess),
      store.dispatch(fetchUserAuthMapping),
      store.dispatch(updateSystemUseNotice(null)),
      // eslint-disable-next-line no-console
      fetchAndSetCsrfToken().catch((err) => { console.log('error on csrf load - should still be ok', err); }),
    ],
  );

  render(
    <div>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter basename={basename}>
            <div>
              {GA.init(gaTracking, dev, gaDebug) && <RouteTracker />}
              {enableDAPTracker && <DAPRouteTracker />}
              {isEnabled('noIndex')
                ? (
                  <Helmet>
                    <meta name='robots' content='noindex,nofollow' />
                  </Helmet>
                )
                : null}
              <ReduxTopBar />
              <ReduxNavBar />
              <div className='main-content'>
                <ReduxWorkspaceShutdownBanner />
                <ReduxWorkspaceShutdownPopup />
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
                        (props) => (
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
                      (props) => (
                        <ProtectedContent
                          filter={() => store.dispatch(fetchAccess())}
                          component={UserProfile}
                          {...props}
                        />
                      )
                    }
                  />
                  <Route
                    exact
                    path='/workspace'
                    component={
                      (props) => <ProtectedContent component={Workspace} {...props} />
                    }
                  />
                  <Route
                    exact
                    path={workspaceUrl}
                    component={ErrorWorkspacePlaceholder}
                  />
                  <Route
                    exact
                    path={workspaceErrorUrl}
                    component={ErrorWorkspacePlaceholder}
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
