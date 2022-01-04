/* eslint-disable react/prop-types */
import { lazy, Suspense, useEffect } from 'react';
import {
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
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

  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  return (
    <Layout>
      <Suspense
        fallback={
          <div style={{ height: '100vh' }}>
            <Spinner />
          </div>
        }
      >
        <Routes>
          <Route
            path='/login'
            element={
              <ProtectedContent
                isPublic
                filter={() => store.dispatch(fetchLogin())}
              >
                <ReduxLogin />
              </ProtectedContent>
            }
          />
          <Route
            path='/'
            element={
              <ProtectedContent>
                <IndexPage />
              </ProtectedContent>
            }
          />
          <Route
            path='/submission'
            element={
              <ProtectedContent isAdminOnly>
                <SubmissionPage />
              </ProtectedContent>
            }
          />
          <Route
            path='/submission/files'
            element={
              <ProtectedContent isAdminOnly>
                <ReduxMapFiles navigate={navigate} />
              </ProtectedContent>
            }
          />

          <Route
            path='/submission/map'
            element={
              <ProtectedContent isAdminOnly>
                <ReduxMapDataModel navigate={navigate} />
              </ProtectedContent>
            }
          />
          <Route
            path='/query'
            element={
              <ProtectedContent>
                <GraphQLQuery />
              </ProtectedContent>
            }
          />
          <Route
            path='/identity'
            element={
              <ProtectedContent filter={() => store.dispatch(fetchAccess())}>
                <UserProfile />
              </ProtectedContent>
            }
          />
          <Route
            path='/dd/:node'
            element={
              <ProtectedContent>
                <DataDictionary />
              </ProtectedContent>
            }
          />
          <Route
            path='/dd'
            element={
              <ProtectedContent>
                <DataDictionary />
              </ProtectedContent>
            }
          />
          <Route
            path='/:project/search'
            element={
              <ProtectedContent
                filter={() =>
                  Array.from(searchParams.keys()).length > 0
                    ? // Linking directly to a search result,
                      // so kick-off search here (rather than on button click)
                      store.dispatch(
                        submitSearchForm({
                          project: params.project,
                          ...Object.fromEntries(searchParams.entries()),
                        })
                      )
                    : Promise.resolve('ok')
                }
              >
                <ReduxQueryNode />
              </ProtectedContent>
            }
          />
          <Route
            path='/explorer'
            element={
              <ProtectedContent>
                <Explorer />
              </ProtectedContent>
            }
          />
          {enableResourceBrowser && (
            <Route
              path='/resource-browser'
              element={
                <ProtectedContent>
                  <ResourceBrowser />
                </ProtectedContent>
              }
            />
          )}
          <Route
            path='/:project'
            element={
              <ProtectedContent>
                <ProjectSubmission />
              </ProtectedContent>
            }
          />
          {/* <Route
            path='/indexing'
            element={
              <ProtectedContent>
                <Indexing />
              </ProtectedContent>
            }
          />
          <Route
            path='/files/*'
            element={
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
            path='/workspace'
            element={
              <ProtectedContent>
                <Workspace />
              </ProtectedContent>
            }
          />
          <Route path={workspaceUrl} element={<ErrorWorkspacePlaceholder />} />
          <Route
            path={workspaceErrorUrl}
            element={<ErrorWorkspacePlaceholder />}
          /> */}
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
