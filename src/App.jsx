import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Spinner from './gen3-ui-component/components/Spinner/Spinner';

import Layout from './Layout';
import ReduxLogin, { fetchLogin } from './Login/ReduxLogin';
import ProtectedContent from './Login/ProtectedContent';
import { fetchCoreMetadata } from './CoreMetadata/reduxer';
import { fetchAccess } from './UserProfile/ReduxUserProfile';
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
        <Layout>
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
                    {...props}
                  >
                    <ReduxLogin
                      history={props.history}
                      location={props.location}
                      params={props.match.params}
                    />
                  </ProtectedContent>
                )}
              />
              <Route
                exact
                path='/'
                component={(props) => (
                  <ProtectedContent {...props}>
                    <IndexPage
                      history={props.history}
                      location={props.location}
                      params={props.match.params}
                    />
                  </ProtectedContent>
                )}
              />
              <Route
                exact
                path='/submission'
                component={(props) => (
                  <ProtectedContent isAdminOnly {...props}>
                    <SubmissionPage
                      history={props.history}
                      location={props.location}
                      params={props.match.params}
                    />
                  </ProtectedContent>
                )}
              />
              <Route
                exact
                path='/submission/files'
                component={(props) => (
                  <ProtectedContent isAdminOnly {...props}>
                    <ReduxMapFiles
                      history={props.history}
                      location={props.location}
                      params={props.match.params}
                    />
                  </ProtectedContent>
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
                  >
                    <ReduxMapDataModel
                      history={props.history}
                      location={props.location}
                      params={props.match.params}
                    />
                  </ProtectedContent>
                )}
              />
              <Route
                exact
                path='/document'
                component={(props) => (
                  <ProtectedContent {...props}>
                    <DocumentPage
                      history={props.history}
                      location={props.location}
                      params={props.match.params}
                    />
                  </ProtectedContent>
                )}
              />
              <Route
                path='/query'
                component={(props) => (
                  <ProtectedContent {...props}>
                    <GraphQLQuery
                      history={props.history}
                      location={props.location}
                      params={props.match.params}
                    />
                  </ProtectedContent>
                )}
              />
              <Route
                path='/identity'
                component={(props) => (
                  <ProtectedContent
                    filter={() => store.dispatch(fetchAccess())}
                    {...props}
                  >
                    <UserProfile
                      history={props.history}
                      location={props.location}
                      params={props.match.params}
                    />
                  </ProtectedContent>
                )}
              />
              <Route
                path='/indexing'
                component={(props) => (
                  <ProtectedContent {...props}>
                    <Indexing
                      history={props.history}
                      location={props.location}
                      params={props.match.params}
                    />
                  </ProtectedContent>
                )}
              />
              <Route
                path='/quiz'
                component={(props) => (
                  <ProtectedContent {...props}>
                    <UserAgreementCert
                      history={props.history}
                      location={props.location}
                      params={props.match.params}
                    />
                  </ProtectedContent>
                )}
              />
              <Route
                path='/dd/:node'
                component={(props) => (
                  <ProtectedContent {...props}>
                    <DataDictionary
                      history={props.history}
                      location={props.location}
                      params={props.match.params}
                    />
                  </ProtectedContent>
                )}
              />
              <Route
                path='/dd'
                component={(props) => (
                  <ProtectedContent {...props}>
                    <DataDictionary
                      history={props.history}
                      location={props.location}
                      params={props.match.params}
                    />
                  </ProtectedContent>
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
                    {...props}
                  >
                    <CoreMetadataPage
                      history={props.history}
                      location={props.location}
                      params={props.match.params}
                    />
                  </ProtectedContent>
                )}
              />
              <Route
                path='/files'
                component={(props) => (
                  <ProtectedContent {...props}>
                    <GuppyDataExplorer />
                  </ProtectedContent>
                )}
              />
              <Route
                path='/workspace'
                component={(props) => (
                  <ProtectedContent {...props}>
                    <Workspace
                      history={props.history}
                      location={props.location}
                      params={props.match.params}
                    />
                  </ProtectedContent>
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
                    const searchParams = new URLSearchParams(
                      props.location.search
                    );

                    return Array.from(searchParams).length > 0
                      ? // Linking directly to a search result,
                        // so kick-off search here (rather than on button click)
                        store.dispatch(
                          submitSearchForm({
                            project: props.match.params.project,
                            ...Object.fromEntries(searchParams),
                          })
                        )
                      : Promise.resolve('ok');
                  };
                  return (
                    <ProtectedContent filter={queryFilter} {...props}>
                      <ReduxQueryNode
                        history={props.history}
                        location={props.location}
                        params={props.match.params}
                      />
                    </ProtectedContent>
                  );
                }}
              />
              <Route
                path='/explorer'
                component={(props) => (
                  <ProtectedContent {...props}>
                    <GuppyDataExplorer
                      history={props.history}
                      location={props.location}
                      params={props.match.params}
                    />
                  </ProtectedContent>
                )}
              />
              {components.privacyPolicy &&
                (!!components.privacyPolicy.file ||
                  !!components.privacyPolicy.routeHref) && (
                  <Route path='/privacy-policy' component={PrivacyPolicy} />
                )}
              {enableResourceBrowser && (
                <Route
                  path='/resource-browser'
                  component={(props) => (
                    <ProtectedContent {...props}>
                      <ResourceBrowser
                        history={props.history}
                        location={props.location}
                        params={props.match.params}
                      />
                    </ProtectedContent>
                  )}
                />
              )}
              <Route
                path='/:project'
                component={(props) => (
                  <ProtectedContent {...props}>
                    <ProjectSubmission
                      history={props.history}
                      location={props.location}
                      params={props.match.params}
                    />
                  </ProtectedContent>
                )}
              />
            </Switch>
          </Suspense>
        </Layout>
        <ScreenSizeWarning />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
