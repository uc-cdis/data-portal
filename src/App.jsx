import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import querystring from 'querystring';
import { Helmet } from 'react-helmet';
import Spinner from './gen3-ui-component/components/Spinner/Spinner';

import ReduxLogin, { fetchLogin } from './Login/ReduxLogin';
import ProtectedContent from './Login/ProtectedContent';
import { fetchCoreMetadata } from './CoreMetadata/reduxer';
import { fetchAccess } from './UserProfile/ReduxUserProfile';
import { ReduxNavBar, ReduxTopBar, ReduxFooter } from './Layout/reduxer';
import { submitSearchForm } from './QueryNode/ReduxQueryNode';
import {
  basename,
  dev,
  gaDebug,
  workspaceUrl,
  workspaceErrorUrl,
  enableResourceBrowser,
} from './localconf';
import { gaTracking, components } from './params';
import GA, { RouteTracker } from './components/GoogleAnalytics';
import isEnabled from './helpers/featureFlags';
import ScreenSizeWarning from './components/ScreenSizeWarning';

// lazy-loaded pages
const CoreMetadataPage = React.lazy(() => import('./CoreMetadata/page'));
const DataDictionary = React.lazy(() => import('./DataDictionary'));
const DocumentPage = React.lazy(() => import('./Document/page'));
const ErrorWorkspacePlaceholder = React.lazy(() =>
  import('./Workspace/ErrorWorkspacePlaceholder')
);
const GraphQLQuery = React.lazy(() => import('./GraphQLEditor/ReduxGqlEditor'));
const GuppyDataExplorer = React.lazy(() => import('./GuppyDataExplorer'));
const Indexing = React.lazy(() => import('./Indexing/Indexing'));
const IndexPage = React.lazy(() => import('./Index/page'));
const PrivacyPolicy = React.lazy(() => import('./PrivacyPolicy/PrivacyPolicy'));
const ProjectSubmission = React.lazy(() =>
  import('./Submission/ReduxProjectSubmission')
);
const ReduxMapDataModel = React.lazy(() =>
  import('./Submission/ReduxMapDataModel')
);
const ReduxMapFiles = React.lazy(() => import('./Submission/ReduxMapFiles'));
const ReduxQueryNode = React.lazy(() => import('./QueryNode/ReduxQueryNode'));
const SubmissionPage = React.lazy(() => import('./Submission/page'));
const ResourceBrowser = React.lazy(() => import('./ResourceBrowser'));
const UserAgreementCert = React.lazy(() =>
  import('./UserAgreement/ReduxCertPopup')
);
const UserProfile = React.lazy(() => import('./UserProfile/ReduxUserProfile'));
const Workspace = React.lazy(() => import('./Workspace'));

function App({ store }) {
  return (
    <Provider store={store}>
      <BrowserRouter basename={basename}>
        {GA.init(gaTracking, dev, gaDebug) && <RouteTracker />}
        {isEnabled('noIndex') && (
          <Helmet>
            <meta name='robots' content='noindex,nofollow' />
          </Helmet>
        )}
        <ReduxTopBar />
        <ReduxNavBar />
        <Suspense
          fallback={
            <div style={{ height: '100vh' }}>
              <Spinner />
            </div>
          }
        >
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
                <ProtectedContent component={UserAgreementCert} {...props} />
              )}
            />
            <Route
              path='/dd/:node'
              component={(props) => (
                <ProtectedContent component={DataDictionary} {...props} />
              )}
            />
            <Route
              path='/dd'
              component={(props) => (
                <ProtectedContent component={DataDictionary} {...props} />
              )}
            />
            <Route
              exact
              path='/files/*'
              component={(props) => (
                <ProtectedContent
                  filter={() =>
                    store.dispatch(fetchCoreMetadata(props.match.params[0]))
                  }
                  component={CoreMetadataPage}
                  {...props}
                />
              )}
            />
            <Route
              path='/files'
              component={(props) => (
                <ProtectedContent component={GuppyDataExplorer} {...props} />
              )}
            />
            <Route
              path='/workspace'
              component={(props) => (
                <ProtectedContent component={Workspace} {...props} />
              )}
            />
            <Route path={workspaceUrl} component={ErrorWorkspacePlaceholder} />
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
                    location.search ? location.search.replace(/^\?+/, '') : ''
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
            {isEnabled('explorer') && (
              <Route
                path='/explorer'
                component={(props) => (
                  <ProtectedContent component={GuppyDataExplorer} {...props} />
                )}
              />
            )}
            {components.privacyPolicy &&
              (!!components.privacyPolicy.file ||
                !!components.privacyPolicy.routeHref) && (
                <Route path='/privacy-policy' component={PrivacyPolicy} />
              )}
            {enableResourceBrowser && (
              <Route
                path='/resource-browser'
                component={(props) => (
                  <ProtectedContent component={ResourceBrowser} {...props} />
                )}
              />
            )}
            <Route
              path='/:project'
              component={(props) => (
                <ProtectedContent component={ProjectSubmission} {...props} />
              )}
            />
          </Switch>
        </Suspense>
        <ReduxFooter
          logos={components.footerLogos}
          privacyPolicy={components.privacyPolicy}
        />
        <ScreenSizeWarning />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
