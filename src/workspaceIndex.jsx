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
import { createBrowserHistory } from 'history';
import {
  createReactRouterV5Options,
  getWebInstrumentations,
  initializeFaro,
  ReactIntegration,
  FaroRoute,
} from '@grafana/faro-react';
import { ThemeProvider } from 'styled-components';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleUp, faAngleDown, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
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
  basename, gaTrackingId, workspaceUrl, workspaceErrorUrl, enableDAPTracker,
  ddApplicationId, ddClientToken, ddEnv, ddUrl, ddSampleRate, knownBotRegex,
  grafanaFaroConfig, hostnameWithSubdomain,
} from './localconf';
import { portalVersion } from './versions';
import { components } from './params';
import { GAInit, GARouteTracker } from './components/GoogleAnalytics';
import { DAPRouteTracker } from './components/DAPAnalytics';
import isEnabled from './helpers/featureFlags';
import sessionMonitor from './SessionMonitor';
import workspaceSessionMonitor from './Workspace/WorkspaceSessionMonitor';
import Workspace from './Workspace';
import ReduxWorkspaceShutdownPopup from './Popup/ReduxWorkspaceShutdownPopup';
import ReduxWorkspaceShutdownBanner from './Popup/ReduxWorkspaceShutdownBanner';
import ErrorWorkspacePlaceholder from './Workspace/ErrorWorkspacePlaceholder';
import ReduxAuthTimeoutPopup from './Popup/ReduxAuthTimeoutPopup';

// monitor user's session
sessionMonitor.start();
workspaceSessionMonitor.start();

// render the app after the store is configured
async function init() {
  const store = await getReduxStore();

  // Datadog setup
  if (ddApplicationId && !ddClientToken) {
    // eslint-disable-next-line no-console
    console.warn('Datadog applicationId is set, but clientToken is missing');
  } else if (!ddApplicationId && ddClientToken) {
    // eslint-disable-next-line no-console
    console.warn('Datadog clientToken is set, but applicationId is missing');
  } else if (ddApplicationId && ddClientToken) {
    const conditionalSampleRate = knownBotRegex.test(navigator.userAgent) ? 0 : ddSampleRate;
    datadogRum.init({
      applicationId: ddApplicationId,
      clientToken: ddClientToken,
      site: ddUrl,
      service: 'portal',
      env: ddEnv,
      version: portalVersion,
      sampleRate: conditionalSampleRate,
      trackInteractions: true,
    });
  }

  // setup Grafana Faro
  const history = createBrowserHistory();
  // to filter bots from RUM, see https://grafana.com/docs/grafana-cloud/monitor-applications/frontend-observability/instrument/filter-bots/#filter-bots-by-user-agent
  let conditionalSampleRate = knownBotRegex.test(navigator.userAgent) ? 0 : grafanaFaroConfig.grafanaFaroSampleRate;
  if (!grafanaFaroConfig.grafanaFaroEnable) {
    conditionalSampleRate = 0;
  }
  initializeFaro({
    url: grafanaFaroConfig.grafanaFaroUrl,
    app: {
      name: 'portal',
      version: portalVersion,
      namespace: grafanaFaroConfig.grafanaFaroNamespace,
      environment: hostnameWithSubdomain,
    },
    instrumentations: [
      ...getWebInstrumentations(),
      new ReactIntegration({
        router: createReactRouterV5Options({
          history,
          Route,
        }),
      }),
    ],
    sessionTracking: {
      enabled: true,
      persistent: true,
      samplingRate: conditionalSampleRate,
    },
    ignoreUrls: ['https://*.logs.datadoghq.com', 'https://*.browser-intake-ddog-gov.com', 'https://www.google-analytics.com', 'https://*.analytics.google.com', 'https://analytics.google.com', 'https://*.g.doubleclick.net'],
  });

  // FontAwesome icons
  library.add(faAngleUp, faAngleDown, faExternalLinkAlt);

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
              {(GAInit(gaTrackingId)) && <GARouteTracker />}
              {enableDAPTracker && <DAPRouteTracker />}
              {isEnabled('noIndex')
                ? (
                  <Helmet>
                    <meta name='robots' content='noindex,nofollow' />
                  </Helmet>
                )
                : null}
              <header>
                <ReduxTopBar />
                <ReduxNavBar />
              </header>
              <div className='main-content' id='main-content'>
                <ReduxWorkspaceShutdownBanner />
                <ReduxWorkspaceShutdownPopup />
                <Switch>
                  {/* process with trailing and duplicate slashes first */}
                  {/* see https://github.com/ReactTraining/react-router/issues/4841#issuecomment-523625186 */}
                  {/* Removes trailing slashes */}
                  <FaroRoute
                    path='/:url*(/+)'
                    exact
                    strict
                    render={({ location }) => (
                      <Redirect to={location.pathname.replace(/\/+$/, '')} />
                    )}
                  />
                  {/* Removes duplicate slashes in the middle of the URL */}
                  <FaroRoute
                    path='/:url(.*//+.*)'
                    exact
                    strict
                    render={({ match }) => (
                      <Redirect to={`/${match.params.url.replace(/\/\/+/, '/')}`} />
                    )}
                  />
                  <FaroRoute
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
                  <FaroRoute
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
                  <FaroRoute
                    exact
                    path='/workspace'
                    component={
                      (props) => <ProtectedContent component={Workspace} {...props} />
                    }
                  />
                  <FaroRoute
                    exact
                    path={workspaceUrl}
                    component={ErrorWorkspacePlaceholder}
                  />
                  <FaroRoute
                    exact
                    path={workspaceErrorUrl}
                    component={ErrorWorkspacePlaceholder}
                  />
                  <FaroRoute
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
            <ReduxAuthTimeoutPopup />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </div>,
    document.getElementById('root'),
  );
}

init();
