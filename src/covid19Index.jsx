import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import {
  BrowserRouter, Route, Switch, Redirect,
} from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import querystring from 'querystring';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import ReactGA from 'react-ga';
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
import Covid19IndexPage from './Index/covid19Page';
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
import { ReduxNavBar, ReduxTopBar, ReduxFooter } from './Layout/reduxer';
import ReduxQueryNode, { submitSearchForm } from './QueryNode/ReduxQueryNode';
import {
  basename, dev, gaDebug, workspaceUrl, workspaceErrorUrl,
  indexPublic, explorerPublic, enableResourceBrowser, resourceBrowserPublic, enableDAPTracker,
  discoveryConfig, ddApplicationId, ddClientToken, ddEnv, ddSampleRate,
} from './localconf';
import { portalVersion } from './versions';
import { gaTracking, components } from './params';
import GA, { RouteTracker } from './components/GoogleAnalytics';
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
import NotFound from './components/NotFound';

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
  library.add(faAngleUp, faAngleDown);

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
                    path='/'
                    component={
                      (props) => (
                        <ProtectedContent
                          public={indexPublic}
                          component={Covid19IndexPage}
                          {...props}
                        />
                      )
                    }
                  />
                  <Route
                    exact
                    path='/submission'
                    component={
                      (props) => <ProtectedContent component={HomePage} {...props} />
                    }
                  />
                  <Route
                    exact
                    path='/submission/files'
                    component={
                      (props) => <ProtectedContent component={ReduxMapFiles} {...props} />
                    }
                  />
                  <Route
                    exact
                    path='/submission/map'
                    component={
                      (props) => <ProtectedContent component={ReduxMapDataModel} {...props} />
                    }
                  />
                  <Route
                    exact
                    path='/document'
                    component={
                      (props) => <ProtectedContent component={DocumentPage} {...props} />
                    }
                  />
                  <Route
                    exact
                    path='/query'
                    component={
                      (props) => <ProtectedContent component={GraphQLQuery} {...props} />
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
                  <Route
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
                  <Route
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
                  <Route
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
                  <Route
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
                  <Route
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
                      <Route
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
                      <Route
                        exact
                        path='/privacy-policy'
                        component={ReduxPrivacyPolicy}
                      />
                    )
                    : null}
                  {enableResourceBrowser
                    ? (
                      <Route
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
                  {isEnabled('discovery')
                    && (
                      <Route
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
                    <Route
                      exact
                      path='/discovery/:studyUID'
                      component={
                        (props) => (
                          <ProtectedContent
                            public
                            component={Discovery}
                            {...props}
                          />
                        )
                      }
                    />
                  )}
                  <Route
                    path='/not-found'
                    component={NotFound}
                  />
                  <Route
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
                  <Route
                    path='*'
                    component={NotFound}
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
