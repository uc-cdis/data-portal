/* eslint-disable react/prop-types */
import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Spinner from './gen3-ui-component/components/Spinner/Spinner';

import Layout from './Layout';
import ReduxLogin, { fetchLogin } from './Login/ReduxLogin';
import ProtectedContent from './Login/ProtectedContent';
// import { fetchCoreMetadata } from './CoreMetadata/reduxer';
import { fetchAccess } from './UserProfile/ReduxUserProfile';
import { submitSearchForm } from './QueryNode/ReduxQueryNode';
import {
  basename,
  dev,
  enableResourceBrowser,
  gaDebug,
  // workspaceUrl,
  // workspaceErrorUrl,
} from './localconf';
import { gaTracking } from './params';
import GA, { RouteTracker } from './components/GoogleAnalytics';
import isEnabled from './helpers/featureFlags';

// lazy-loaded pages
const DataDictionary = React.lazy(() => import('./DataDictionary'));
const GraphQLQuery = React.lazy(() => import('./GraphQLEditor/ReduxGqlEditor'));
const GuppyDataExplorer = React.lazy(() => import('./GuppyDataExplorer'));
const IndexPage = React.lazy(() => import('./Index/page'));
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
const UserProfile = React.lazy(() => import('./UserProfile/ReduxUserProfile'));
// const CoreMetadataPage = React.lazy(() => import('./CoreMetadata/page'));
// const ErrorWorkspacePlaceholder = React.lazy(() =>
//   import('./Workspace/ErrorWorkspacePlaceholder')
// );
// const Indexing = React.lazy(() => import('./Indexing/Indexing'));
// const Workspace = React.lazy(() => import('./Workspace'));

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
                component={({ location }) => (
                  <ProtectedContent
                    isPublic
                    filter={() => store.dispatch(fetchLogin())}
                  >
                    <ReduxLogin location={location} />
                  </ProtectedContent>
                )}
              />
              <Route
                exact
                path='/'
                component={({ history }) => (
                  <ProtectedContent>
                    <IndexPage history={history} />
                  </ProtectedContent>
                )}
              />
              <Route
                exact
                path='/submission'
                component={
                  <ProtectedContent isAdminOnly>
                    <SubmissionPage />
                  </ProtectedContent>
                }
              />
              <Route
                exact
                path='/submission/files'
                component={({ history }) => (
                  <ProtectedContent isAdminOnly>
                    <ReduxMapFiles history={history} />
                  </ProtectedContent>
                )}
              />
              <Route
                exact
                path='/submission/map'
                component={({ history }) => (
                  <ProtectedContent isAdminOnly component={ReduxMapDataModel}>
                    <ReduxMapDataModel history={history} />
                  </ProtectedContent>
                )}
              />
              <Route
                path='/query'
                component={({ location }) => (
                  <ProtectedContent>
                    <GraphQLQuery location={location} />
                  </ProtectedContent>
                )}
              />
              <Route
                path='/identity'
                component={
                  <ProtectedContent
                    filter={() => store.dispatch(fetchAccess())}
                  >
                    <UserProfile />
                  </ProtectedContent>
                }
              />
              <Route
                path='/dd/:node'
                component={
                  <ProtectedContent>
                    <DataDictionary />
                  </ProtectedContent>
                }
              />
              <Route
                path='/dd'
                component={
                  <ProtectedContent>
                    <DataDictionary />
                  </ProtectedContent>
                }
              />
              <Route
                path='/:project/search'
                component={({ location, match }) => {
                  const queryFilter = () => {
                    const searchParams = new URLSearchParams(location.search);

                    return Array.from(searchParams).length > 0
                      ? // Linking directly to a search result,
                        // so kick-off search here (rather than on button click)
                        store.dispatch(
                          submitSearchForm({
                            project: match.params.project,
                            ...Object.fromEntries(searchParams),
                          })
                        )
                      : Promise.resolve('ok');
                  };
                  return (
                    <ProtectedContent filter={queryFilter}>
                      <ReduxQueryNode params={match.params} />
                    </ProtectedContent>
                  );
                }}
              />
              <Route
                path='/explorer'
                component={
                  <ProtectedContent>
                    <GuppyDataExplorer />
                  </ProtectedContent>
                }
              />
              {enableResourceBrowser && (
                <Route
                  path='/resource-browser'
                  component={
                    <ProtectedContent>
                      <ResourceBrowser />
                    </ProtectedContent>
                  }
                />
              )}
              <Route
                path='/:project'
                component={({ match }) => (
                  <ProtectedContent>
                    <ProjectSubmission params={match.params} />
                  </ProtectedContent>
                )}
              />
              {/* <Route
                path='/indexing'
                component={
                  <ProtectedContent>
                    <Indexing />
                  </ProtectedContent>
                }
              />
              <Route
                exact
                path='/files/*'
                component={
                  <ProtectedContent
                    filter={() =>
                      store.dispatch(fetchCoreMetadata(props.match.params[0]))
                    }
                  >
                    <CoreMetadataPage />
                  </ProtectedContent>
                }
              />
              <Route
                path='/files'
                component={
                  <ProtectedContent>
                    <GuppyDataExplorer />
                  </ProtectedContent>
                }
              />
              <Route
                path='/workspace'
                component={
                  <ProtectedContent>
                    <Workspace />
                  </ProtectedContent>
                }
              />
              <Route
                path={workspaceUrl}
                component={ErrorWorkspacePlaceholder}
              />
              <Route
                path={workspaceErrorUrl}
                component={ErrorWorkspacePlaceholder}
              /> */}
            </Switch>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
