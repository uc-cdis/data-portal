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
import querystring from 'querystring';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAngleUp, faAngleDown, faEnvelopeSquare, faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookSquare,
  faTwitterSquare,
  faLinkedin,
  faYoutubeSquare,
  faFlickr,
  faInstagramSquare,
  faPinterestSquare,
} from '@fortawesome/free-brands-svg-icons';
import { Helmet } from 'react-helmet';
import { datadogRum } from '@datadog/browser-rum';

import 'antd/dist/antd.css';
import '@gen3/ui-component/dist/css/base.less';
import { fetchAndSetCsrfToken } from './configs';
import {
  fetchDictionary,
  fetchSchema,
  fetchVersionInfo,
  fetchUserAccess,
  fetchUserAuthMapping,
  updateSystemUseNotice,
} from './actions';
import ReduxLogin, { fetchLogin } from './Login/ReduxLogin';
import ProtectedContent from './Login/ProtectedContent';
import HomePage from './Homepage/page';
import DocumentPage from './Document/page';
import { fetchCoreMetadata, ReduxCoreMetadataPage } from './CoreMetadata/reduxer';
import Indexing from './Indexing/Indexing';
import NCTIndexPage from './Index/nctPage';
import DataDictionary from './DataDictionary';
import ReduxPrivacyPolicy from './PrivacyPolicy/ReduxPrivacyPolicy';
import ProjectSubmission from './Submission/ReduxProjectSubmission';
import ReduxMapFiles from './Submission/ReduxMapFiles';
import ReduxMapDataModel from './Submission/ReduxMapDataModel';
import UserProfile, { fetchAccess } from './UserProfile/ReduxUserProfile';
import UserAgreementCert from './UserAgreement/ReduxCertPopup';
import GraphQLQuery from './GraphQLEditor/ReduxGqlEditor';
import theme from './theme';
import getReduxStore from './reduxStore';
import { ReduxNavBar, ReduxTopBar } from './Layout/reduxer';
import ReduxQueryNode, { submitSearchForm } from './QueryNode/ReduxQueryNode';
import {
  basename, gaTrackingId, workspaceUrl, workspaceErrorUrl,
  indexPublic, explorerPublic, enableResourceBrowser, resourceBrowserPublic, enableDAPTracker,
  discoveryConfig, ddApplicationId, ddClientToken, ddEnv, ddUrl, ddSampleRate, knownBotRegex,
  userAccessToSite, grafanaFaroConfig, hostnameWithSubdomain,
} from './localconf';
import { portalVersion } from './versions';
import Analysis from './Analysis/Analysis';
import ReduxAnalysisApp from './Analysis/ReduxAnalysisApp';
import { components } from './params';
import { GAInit, GARouteTracker } from './components/GoogleAnalytics';
import { DAPRouteTracker } from './components/DAPAnalytics';
import GuppyDataExplorer from './GuppyDataExplorer';
import isEnabled from './helpers/featureFlags';
import sessionMonitor from './SessionMonitor';
import workspaceSessionMonitor from './Workspace/WorkspaceSessionMonitor';
import Workspace from './Workspace';
import ResourceBrowser from './ResourceBrowser';
import Discovery from './Discovery';
import ReduxWorkspaceShutdownPopup from './Popup/ReduxWorkspaceShutdownPopup';
import ReduxWorkspaceShutdownBanner from './Popup/ReduxWorkspaceShutdownBanner';
import ErrorWorkspacePlaceholder from './Workspace/ErrorWorkspacePlaceholder';
import './nctIndex.css';
import { ReduxStudyViewer, ReduxSingleStudyViewer } from './StudyViewer/reduxer';
import NotFound from './components/NotFound';
import FooterNIAID from './components/layout/FooterNIAID';

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

  await Promise.all(
    [
      store.dispatch(fetchSchema),
      store.dispatch(fetchDictionary),
      store.dispatch(fetchVersionInfo),
      // resources can be open to anonymous users, so fetch access:
      store.dispatch(fetchUserAccess),
      store.dispatch(fetchUserAuthMapping),
      store.dispatch(updateSystemUseNotice(null)),
      // eslint-disable-next-line no-console
      fetchAndSetCsrfToken().catch((err) => { console.log('error on csrf load - should still be ok', err); }),
    ],
  );
  // FontAwesome icons
  library.add(faAngleUp,
    faAngleDown,
    faEnvelopeSquare,
    faFacebookSquare,
    faTwitterSquare,
    faLinkedin,
    faYoutubeSquare,
    faFlickr,
    faInstagramSquare,
    faPinterestSquare,
    faExternalLinkAlt);

  render(
    <div>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter basename={basename}>
            <div className='main-page'>
              {(GAInit(gaTrackingId)) && <GARouteTracker />}
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
                    path='/'
                    component={
                      (props) => (
                        <ProtectedContent
                          public={indexPublic}
                          component={NCTIndexPage}
                          {...props}
                        />
                      )
                    }
                  />
                  <FaroRoute
                    exact
                    path='/submission'
                    component={
                      (props) => <ProtectedContent component={HomePage} {...props} />
                    }
                  />
                  <FaroRoute
                    exact
                    path='/submission/files'
                    component={
                      (props) => <ProtectedContent component={ReduxMapFiles} {...props} />
                    }
                  />
                  <FaroRoute
                    exact
                    path='/submission/map'
                    component={
                      (props) => <ProtectedContent component={ReduxMapDataModel} {...props} />
                    }
                  />
                  <FaroRoute
                    exact
                    path='/document'
                    component={
                      (props) => <ProtectedContent component={DocumentPage} {...props} />
                    }
                  />
                  <FaroRoute
                    exact
                    path='/query'
                    component={
                      (props) => <ProtectedContent component={GraphQLQuery} {...props} />
                    }
                  />
                  {
                    isEnabled('analysis')
                      ? (
                        <FaroRoute
                          exact
                          path='/analysis/:app'
                          component={
                            (props) => <ProtectedContent component={ReduxAnalysisApp} {...props} />
                          }
                        />
                      )
                      : null
                  }
                  {
                    isEnabled('analysis')
                      ? (
                        <FaroRoute
                          exact
                          path='/analysis'
                          component={
                            (props) => <ProtectedContent component={Analysis} {...props} />
                          }
                        />
                      )
                      : null
                  }
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
                    path='/indexing'
                    component={
                      (props) => (
                        <ProtectedContent
                          component={Indexing}
                          {...props}
                        />
                      )
                    }
                  />
                  <FaroRoute
                    exact
                    path='/quiz'
                    component={
                      (props) => (
                        <ProtectedContent
                          component={UserAgreementCert}
                          {...props}
                        />
                      )
                    }
                  />
                  <FaroRoute
                    exact
                    path='/dd/:node'
                    component={
                      (props) => (
                        <ProtectedContent
                          public
                          component={DataDictionary}
                          {...props}
                        />
                      )
                    }
                  />
                  <FaroRoute
                    exact
                    path='/dd'
                    component={
                      (props) => (
                        <ProtectedContent
                          public
                          component={DataDictionary}
                          {...props}
                        />
                      )
                    }
                  />
                  <FaroRoute
                    exact
                    path='/files/*'
                    component={
                      (props) => (
                        <ProtectedContent
                          filter={() => store.dispatch(fetchCoreMetadata(props.match.params[0]))}
                          component={ReduxCoreMetadataPage}
                          {...props}
                        />
                      )
                    }
                  />
                  <FaroRoute
                    exact
                    path='/files'
                    component={
                      (props) => (
                        <ProtectedContent
                          public={explorerPublic}
                          component={GuppyDataExplorer}
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
                    path='/:project/search'
                    component={
                      (props) => {
                        const queryFilter = () => {
                          const { location } = props;
                          const queryParams = querystring.parse(location.search ? location.search.replace(/^\?+/, '') : '');
                          if (Object.keys(queryParams).length > 0) {
                            // Linking directly to a search result,
                            // so kick-off search here (rather than on button click)
                            return store.dispatch(
                              submitSearchForm({
                                project: props.match.params.project, ...queryParams,
                              }),
                            );
                          }
                          return Promise.resolve('ok');
                        };
                        return (
                          <ProtectedContent
                            filter={queryFilter}
                            component={ReduxQueryNode}
                            {...props}
                          />
                        );
                      }
                    }
                  />
                  {isEnabled('explorer')
                    ? (
                      <FaroRoute
                        exact
                        path='/explorer'
                        component={
                          (props) => (
                            <ProtectedContent
                              public={explorerPublic}
                              component={GuppyDataExplorer}
                              {...props}
                            />
                          )
                        }
                      />
                    )
                    : null}
                  {components.privacyPolicy
                    && (!!components.privacyPolicy.file || !!components.privacyPolicy.routeHref)
                    ? (
                      <FaroRoute
                        exact
                        path='/privacy-policy'
                        component={ReduxPrivacyPolicy}
                      />
                    )
                    : null}
                  {enableResourceBrowser
                    ? (
                      <FaroRoute
                        exact
                        path='/resource-browser'
                        component={
                          (props) => (
                            <ProtectedContent
                              public={resourceBrowserPublic}
                              component={ResourceBrowser}
                              {...props}
                            />
                          )
                        }
                      />
                    )
                    : null}
                  <FaroRoute
                    exact
                    path='/study-viewer/:dataType'
                    component={
                      (props) => (
                        <ProtectedContent
                          public
                          component={ReduxStudyViewer}
                          {...props}
                        />
                      )
                    }
                  />
                  <FaroRoute
                    exact
                    path='/study-viewer/:dataType/:rowAccessor'
                    component={
                      (props) => (
                        <ProtectedContent
                          public
                          component={ReduxSingleStudyViewer}
                          {...props}
                        />
                      )
                    }
                  />
                  {isEnabled('discovery')
                    && (
                      <FaroRoute
                        exact
                        path='/discovery'
                        component={
                          (props) => (
                            <ProtectedContent
                              public={discoveryConfig.public !== false}
                              component={Discovery}
                              {...props}
                            />
                          )
                        }
                      />
                    )}
                  {isEnabled('discovery') && (
                    <FaroRoute
                      exact
                      path='/discovery/:studyUID*'
                      component={
                        (props) => (
                          <ProtectedContent
                            public={discoveryConfig.public !== false}
                            component={Discovery}
                            {...props}
                          />
                        )
                      }
                    />
                  )}
                  <FaroRoute
                    path='/not-found'
                    component={NotFound}
                  />
                  {userAccessToSite?.enabled && (
                    <FaroRoute
                      path={userAccessToSite.deniedPageURL || '/access-denied'}
                      component={AccessDenied}
                    />
                  )}
                  <FaroRoute
                    exact
                    path='/:project'
                    component={
                      (props) => (
                        <ProtectedContent
                          component={ProjectSubmission}
                          {...props}
                        />
                      )
                    }
                  />
                  <FaroRoute
                    path='*'
                    component={NotFound}
                  />
                </Switch>
              </div>
              <FooterNIAID
                logos={components.footerLogos}
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
