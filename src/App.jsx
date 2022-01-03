/* eslint-disable react/prop-types */
import { lazy, Suspense, useEffect } from 'react';
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';
import Spinner from './gen3-ui-component/components/Spinner/Spinner';

import Layout from './Layout';
import ReduxLogin, { fetchLogin } from './Login/ReduxLogin';
import ProtectedContent from './Login/ProtectedContent';
// import { fetchCoreMetadata } from './CoreMetadata/reduxer';
import { fetchAccess } from './UserProfile/ReduxUserProfile';
import { submitSearchForm } from './QueryNode/ReduxQueryNode';
import {
  enableResourceBrowser,
  // workspaceUrl,
  // workspaceErrorUrl,
} from './localconf';
import { fetchVersionInfo } from './actions';

// lazy-loaded pages
const DataDictionary = lazy(() => import('./DataDictionary'));
const Explorer = lazy(() => import('./GuppyDataExplorer'));
const GraphQLQuery = lazy(() => import('./GraphQLEditor/ReduxGqlEditor'));
const IndexPage = lazy(() => import('./Index/page'));
const ProjectSubmission = lazy(() =>
  import('./Submission/ReduxProjectSubmission')
);
const ReduxMapDataModel = lazy(() => import('./Submission/ReduxMapDataModel'));
const ReduxMapFiles = lazy(() => import('./Submission/ReduxMapFiles'));
const ReduxQueryNode = lazy(() => import('./QueryNode/ReduxQueryNode'));
const SubmissionPage = lazy(() => import('./Submission/page'));
const ResourceBrowser = lazy(() => import('./ResourceBrowser'));
const UserProfile = lazy(() => import('./UserProfile/ReduxUserProfile'));
// const CoreMetadataPage = lazy(() => import('./CoreMetadata/page'));
// const ErrorWorkspacePlaceholder = lazy(() =>
//   import('./Workspace/ErrorWorkspacePlaceholder')
// );
// const Indexing = lazy(() => import('./Indexing/Indexing'));
// const Workspace = lazy(() => import('./Workspace'));

function App({ store }) {
  useEffect(() => {
    store.dispatch(fetchVersionInfo());
  }, []);

  const history = useHistory();
  const location = useLocation();
  const params = useParams();

  return (
    <Layout>
      <Suspense
        fallback={
          <div style={{ height: '100vh' }}>
            <Spinner />
          </div>
        }
      >
        <Switch>
          <Route path='/login'>
            <ProtectedContent
              isPublic
              filter={() => store.dispatch(fetchLogin())}
            >
              <ReduxLogin />
            </ProtectedContent>
          </Route>
          <Route exact path='/'>
            <ProtectedContent>
              <IndexPage />
            </ProtectedContent>
          </Route>
          <Route exact path='/submission'>
            <ProtectedContent isAdminOnly>
              <SubmissionPage />
            </ProtectedContent>
          </Route>
          <Route exact path='/submission/files'>
            <ProtectedContent isAdminOnly>
              <ReduxMapFiles history={history} />
            </ProtectedContent>
          </Route>
          <Route exact path='/submission/map'>
            <ProtectedContent isAdminOnly>
              <ReduxMapDataModel history={history} />
            </ProtectedContent>
          </Route>
          <Route path='/query'>
            <ProtectedContent>
              <GraphQLQuery />
            </ProtectedContent>
          </Route>
          <Route path='/identity'>
            <ProtectedContent filter={() => store.dispatch(fetchAccess())}>
              <UserProfile />
            </ProtectedContent>
          </Route>
          <Route path='/dd/:node'>
            <ProtectedContent>
              <DataDictionary />
            </ProtectedContent>
          </Route>
          <Route path='/dd'>
            <ProtectedContent>
              <DataDictionary />
            </ProtectedContent>
          </Route>
          <Route path='/:project/search'>
            <ProtectedContent
              filter={() => {
                const searchParams = new URLSearchParams(location.search);
                return Array.from(searchParams.keys()).length > 0
                  ? // Linking directly to a search result,
                    // so kick-off search here (rather than on button click)
                    store.dispatch(
                      submitSearchForm({
                        project: params.project,
                        ...Object.fromEntries(searchParams.entries()),
                      })
                    )
                  : Promise.resolve('ok');
              }}
            >
              <ReduxQueryNode />
            </ProtectedContent>
          </Route>
          <Route path='/explorer'>
            <ProtectedContent>
              <Explorer />
            </ProtectedContent>
          </Route>
          {enableResourceBrowser && (
            <Route path='/resource-browser'>
              <ProtectedContent>
                <ResourceBrowser />
              </ProtectedContent>
            </Route>
          )}
          <Route path='/:project'>
            <ProtectedContent>
              <ProjectSubmission />
            </ProtectedContent>
          </Route>
          {/* <Route path='/indexing'>
                <ProtectedContent>
                  <Indexing />
                </ProtectedContent>
              </Route>
              <Route
                exact
                path='/files/*'
                component={({ match }) => (
                  <ProtectedContent
                    filter={() =>
                      store.dispatch(fetchCoreMetadata(props.match.params[0]))
                    }
                  >
                    <CoreMetadataPage />
                  </ProtectedContent>
                )}
              />
              <Route path='/workspace'>
                <ProtectedContent>
                  <Workspace />
                </ProtectedContent>
              </Route>
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
  );
}

export default App;
