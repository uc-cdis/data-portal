import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'react-select/dist/react-select.css';
import querystring from 'querystring';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAngleUp,
  faAngleDown,
  faFlask,
  faMicroscope,
} from '@fortawesome/free-solid-svg-icons';
import ReactGA from 'react-ga';
import { Helmet } from 'react-helmet';

import '@gen3/ui-component/dist/css/base.less';
import {
  fetchDictionary,
  fetchSchema,
  fetchVersionInfo,
  fetchUserAccess,
  fetchUserAuthMapping,
} from './actions';
import ReduxLogin, { fetchLogin } from './Login/ReduxLogin';
import ProtectedContent from './Login/ProtectedContent';
import SubmissionPage from './Submission/page';
import DocumentPage from './Document/page';
import CoreMetadataPage from './CoreMetadata/page';
import { fetchCoreMetadata } from './CoreMetadata/reduxer';
import Indexing from './Indexing/Indexing';
import IndexPage from './Index/page';
import DataDictionary from './DataDictionary/.';
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
  basename,
  dev,
  gaDebug,
  workspaceUrl,
  workspaceErrorUrl,
  explorerPublic,
  enableResourceBrowser,
  resourceBrowserPublic,
} from './localconf';
import { gaTracking, components } from './params';
import GA, { RouteTracker } from './components/GoogleAnalytics';
import GuppyDataExplorer from './GuppyDataExplorer/.';
import isEnabled from './helpers/featureFlags';
import sessionMonitor from './SessionMonitor';
import Workspace from './Workspace';
import ResourceBrowser from './ResourceBrowser';
import ErrorWorkspacePlaceholder from './Workspace/ErrorWorkspacePlaceholder';
import './index.less';

// monitor user's session
sessionMonitor.start();

// render the app after the store is configured
async function init() {
  const store = await getReduxStore();

  // asyncSetInterval(() => store.dispatch(fetchUser), 60000);
  ReactGA.initialize(gaTracking);
  ReactGA.pageview(window.location.pathname + window.location.search);
  await Promise.all([
    store.dispatch(fetchSchema),
    store.dispatch(fetchDictionary),
    store.dispatch(fetchVersionInfo),
    // resources can be open to anonymous users, so fetch access:
    store.dispatch(fetchUserAccess),
    store.dispatch(fetchUserAuthMapping),
  ]);
  // FontAwesome icons
  library.add(faAngleUp, faAngleDown, faFlask, faMicroscope);

  render(
    <div>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <MuiThemeProvider>
            <BrowserRouter basename={basename}>
              <div>
                {GA.init(gaTracking, dev, gaDebug) && <RouteTracker />}
                {isEnabled('noIndex') ? (
                  <Helmet>
                    <meta name='robots' content='noindex,nofollow' />
                  </Helmet>
                ) : null}
                <ReduxTopBar />
                <ReduxNavBar />
                <div className='main-content'>
                  <Switch>
                    <Route
                      path='/login'
                      component={(props) => (
                        <ProtectedContent
                          isPublic
                          filter={() => store.dispatch(fetchLogin())}
                          component={ReduxLogin}
                          {...props}
                        />
                      )}
                    />
                    <Route
                      exact
                      path='/'
                      component={(props) => (
                        <ProtectedContent component={IndexPage} {...props} />
                      )}
                    />
                    <Route
                      exact
                      path='/submission'
                      component={(props) => (
                        <ProtectedContent
                          isAdminOnly
                          component={SubmissionPage}
                          {...props}
                        />
                      )}
                    />
                    <Route
                      exact
                      path='/submission/files'
                      component={(props) => (
                        <ProtectedContent
                          isAdminOnly
                          component={ReduxMapFiles}
                          {...props}
                        />
                      )}
                    />
                    <Route
                      exact
                      path='/submission/map'
                      component={(props) => (
                        <ProtectedContent
                          isAdminOnly
                          component={ReduxMapDataModel}
                          {...props}
                        />
                      )}
                    />
                    <Route
                      exact
                      path='/document'
                      component={(props) => (
                        <ProtectedContent component={DocumentPage} {...props} />
                      )}
                    />
                    <Route
                      path='/query'
                      component={(props) => (
                        <ProtectedContent component={GraphQLQuery} {...props} />
                      )}
                    />
                    <Route
                      path='/identity'
                      component={(props) => (
                        <ProtectedContent
                          filter={() => store.dispatch(fetchAccess())}
                          component={UserProfile}
                          {...props}
                        />
                      )}
                    />
                    <Route
                      path='/indexing'
                      component={(props) => (
                        <ProtectedContent component={Indexing} {...props} />
                      )}
                    />
                    <Route
                      path='/quiz'
                      component={(props) => (
                        <ProtectedContent
                          component={UserAgreementCert}
                          {...props}
                        />
                      )}
                    />
                    <Route
                      path='/dd/:node'
                      component={(props) => (
                        <ProtectedContent
                          isPublic
                          component={DataDictionary}
                          {...props}
                        />
                      )}
                    />
                    <Route
                      path='/dd'
                      component={(props) => (
                        <ProtectedContent
                          isPublic
                          component={DataDictionary}
                          {...props}
                        />
                      )}
                    />
                    <Route
                      exact
                      path='/files/*'
                      component={(props) => (
                        <ProtectedContent
                          filter={() =>
                            store.dispatch(
                              fetchCoreMetadata(props.match.params[0])
                            )
                          }
                          component={CoreMetadataPage}
                          {...props}
                        />
                      )}
                    />
                    <Route
                      path='/files'
                      component={(props) => (
                        <ProtectedContent
                          isPublic={explorerPublic}
                          component={GuppyDataExplorer}
                          {...props}
                        />
                      )}
                    />
                    <Route
                      path='/workspace'
                      component={(props) => (
                        <ProtectedContent component={Workspace} {...props} />
                      )}
                    />
                    <Route
                      path={workspaceUrl}
                      component={ErrorWorkspacePlaceholder}
                    />
                    <Route
                      path={workspaceErrorUrl}
                      component={ErrorWorkspacePlaceholder}
                    />
                    <Route
                      path='/:project/search'
                      component={(props) => {
                        const queryFilter = () => {
                          const location = props.location;
                          const queryParams = querystring.parse(
                            location.search
                              ? location.search.replace(/^\?+/, '')
                              : ''
                          );
                          if (Object.keys(queryParams).length > 0) {
                            // Linking directly to a search result,
                            // so kick-off search here (rather than on button click)
                            return store.dispatch(
                              submitSearchForm({
                                project: props.match.params.project,
                                ...queryParams,
                              })
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
                      }}
                    />
                    {isEnabled('explorer') ? (
                      <Route
                        path='/explorer'
                        component={(props) => (
                          <ProtectedContent
                            isPublic={explorerPublic}
                            component={GuppyDataExplorer}
                            {...props}
                          />
                        )}
                      />
                    ) : null}
                    {components.privacyPolicy &&
                    (!!components.privacyPolicy.file ||
                      !!components.privacyPolicy.routeHref) ? (
                      <Route
                        path='/privacy-policy'
                        component={ReduxPrivacyPolicy}
                      />
                    ) : null}
                    {enableResourceBrowser ? (
                      <Route
                        path='/resource-browser'
                        component={(props) => (
                          <ProtectedContent
                            isPublic={resourceBrowserPublic}
                            component={ResourceBrowser}
                            {...props}
                          />
                        )}
                      />
                    ) : null}
                    <Route
                      path='/:project'
                      component={(props) => (
                        <ProtectedContent
                          component={ProjectSubmission}
                          {...props}
                        />
                      )}
                    />
                  </Switch>
                </div>
                <ReduxFooter
                  logos={components.footerLogos}
                  privacyPolicy={components.privacyPolicy}
                />
              </div>
            </BrowserRouter>
          </MuiThemeProvider>
        </ThemeProvider>
      </Provider>
    </div>,
    document.getElementById('root')
  );
}

init();
