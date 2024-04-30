/* eslint-disable react/prop-types */
import { lazy, Suspense, useEffect } from 'react';
import {
  matchPath,
  Navigate,
  Outlet,
  Route,
  Routes,
  useSearchParams,
} from 'react-router-dom';
import Spinner from './gen3-ui-component/components/Spinner/Spinner';

import Layout from './Layout';
import ReduxLogin from './Login/ReduxLogin';
import ProtectedContent from './Login/ProtectedContent';
// import { fetchCoreMetadata } from './CoreMetadata/reduxer';
import {
  enableResourceBrowser,
  // workspaceUrl,
  // workspaceErrorUrl,
} from './localconf';
import { getProjectsList, getTransactionList } from './Submission/relayer';
import { STARTING_DID } from './Submission/utils';
import useSessionMonitor from './hooks/useSessionMonitor';
import {
  fetchDataVersion,
  fetchSurvivalCurveVersion,
} from './redux/versionInfo/asyncThunks';
import { fetchIndexPageCounts } from './redux/index/asyncThunks';
import {
  fetchDictionary,
  fetchUnmappedFiles,
  fetchUnmappedFileStats,
} from './redux/submission/asyncThunks';
import { fetchGuppySchema, fetchSchema } from './redux/graphiql/asyncThunks';
import { fetchAccess } from './redux/userProfile/asyncThunks';
import { adminFetchUsers } from './redux/user/asyncThunks';
import { fetchGraphvizLayout } from './redux/ddgraph/asyncThunks';
import {
  fetchSurvivalConfig,
  fetchFilterSets,
} from './redux/explorer/asyncThunks';
import {
  fetchProjects as fetchDataRequestProjects,
  fetchProjectStates,
} from './redux/dataRequest/asyncThunks';
import { toggleAdminActive } from './redux/dataRequest/slice';
import { useAppDispatch } from './redux/hooks';
import useGoogleAnalytics from './hooks/useGoogleAnalytics';

// lazy-loaded pages
const DataDictionary = lazy(() => import('./DataDictionary'));
const DataRequests = lazy(() => import('./DataRequests'));
const DataRequestCreate = lazy(() => import('./DataRequests/create'));
const Explorer = lazy(() => import('./GuppyDataExplorer'));
const GraphQLQuery = lazy(() => import('./GraphQLEditor/ReduxGqlEditor'));
const IndexPage = lazy(() => import('./Index/page'));
const ProjectSubmission = lazy(
  () => import('./Submission/ReduxProjectSubmission'),
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

function App() {
  useSessionMonitor();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchDataVersion());
    dispatch(fetchSurvivalCurveVersion());
    useGoogleAnalytics();
  }, []);

  return (
    <Routes>
      <Route
        path='/'
        element={
          <Layout>
            <Suspense
              fallback={
                <div style={{ height: '100vh' }}>
                  <Spinner />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </Layout>
        }
      >
        <Route
          index
          element={
            <ProtectedContent
              preload={async () => dispatch(fetchIndexPageCounts())}
            >
              <IndexPage />
            </ProtectedContent>
          }
        />
        <Route
          path='login'
          element={
            <ProtectedContent isLoginPage>
              <ReduxLogin />
            </ProtectedContent>
          }
        />
        <Route
          path='submission'
          element={
            <ProtectedContent
              isAdminOnly
              preload={({ location, state }) => {
                function matchPattern(pattern) {
                  return matchPath(`/submission${pattern}`, location.pathname);
                }

                const { username } = state.user;
                const start = STARTING_DID;

                if (matchPattern('/')) {
                  return Promise.all([
                    dispatch(getProjectsList()),
                    dispatch(getTransactionList()),
                    dispatch(
                      fetchUnmappedFileStats({ start, total: [], username }),
                    ),
                  ]);
                }

                if (matchPattern('/files'))
                  return dispatch(
                    fetchUnmappedFiles({ start, total: [], username }),
                  );

                const { filesToMap } = state.submission;

                if (matchPattern('/map') && filesToMap.length !== 0)
                  return Promise.all([
                    dispatch(fetchDictionary()),
                    dispatch(getProjectsList()),
                  ]);

                if (matchPattern('/:project/*'))
                  return dispatch(fetchDictionary());

                return Promise.resolve();
              }}
            >
              <Outlet />
            </ProtectedContent>
          }
        >
          <Route index element={<SubmissionPage />} />
          <Route path='files' element={<ReduxMapFiles />} />
          <Route path='map' element={<ReduxMapDataModel />} />
          <Route path=':project' element={<Outlet />}>
            <Route index element={<ProjectSubmission />} />
            <Route path='search' element={<ReduxQueryNode />} />
          </Route>
        </Route>
        <Route
          path='query'
          element={
            <ProtectedContent
              preload={() =>
                Promise.all([
                  dispatch(fetchSchema()),
                  dispatch(fetchGuppySchema()),
                ])
              }
            >
              <GraphQLQuery />
            </ProtectedContent>
          }
        />
        <Route
          path='identity'
          element={
            <ProtectedContent preload={() => dispatch(fetchAccess())}>
              <UserProfile />
            </ProtectedContent>
          }
        />
        <Route
          path='dd/*'
          element={
            <ProtectedContent
              preload={() =>
                Promise.all([
                  dispatch(fetchDictionary()),
                  dispatch(fetchGraphvizLayout()),
                ])
              }
            >
              <DataDictionary />
            </ProtectedContent>
          }
        />
        <Route
          path='explorer'
          element={
            <ProtectedContent
              preload={() =>
                Promise.all([
                  dispatch(fetchDictionary()),
                  dispatch(fetchSurvivalConfig()),
                ])
              }
            >
              <Explorer />
            </ProtectedContent>
          }
        />
        {enableResourceBrowser && (
          <Route
            path='resource-browser'
            element={
              <ProtectedContent>
                <ResourceBrowser />
              </ProtectedContent>
            }
          />
        )}
        <Route path='requests' element={<Outlet />}>
          <Route
            index
            element={
              <ProtectedContent
                preload={({ state }) => {
                  if (searchParams.get('admin') === 'true') {
                    let {
                      is_admin,
                      authz: { '/services/amanuensis': serviceAccessMethods },
                    } = state.user;
                    let serviceAccessMethod = Array.isArray(
                      serviceAccessMethods,
                    )
                      ? serviceAccessMethods[0]?.method
                      : undefined;
                    let isAdmin = is_admin || !!serviceAccessMethod;
                    if (isAdmin && !state.dataRequest.isAdminActive) {
                      dispatch(toggleAdminActive());
                    }
                    return Promise.all([
                      dispatch(fetchFilterSets()),
                      dispatch(
                        fetchDataRequestProjects({ triggerReloading: false }),
                      ),
                      dispatch(fetchProjectStates()),
                    ]);
                  }
                  return dispatch(
                    fetchDataRequestProjects({ triggerReloading: false }),
                  );
                }}
              >
                <DataRequests />
              </ProtectedContent>
            }
          />
          <Route
            path='create'
            element={
              <ProtectedContent
                preload={({ state }) => {
                  let {
                    is_admin,
                    authz: { '/services/amanuensis': serviceAccessMethods },
                  } = state.user;
                  let serviceAccessMethod = Array.isArray(serviceAccessMethods)
                    ? serviceAccessMethods[0]?.method
                    : undefined;
                  let isAdmin = is_admin || !!serviceAccessMethod;
                  /** @type {Promise[]} */
                  let requests = [dispatch(fetchFilterSets())];
                  if (isAdmin) {
                    requests.push(dispatch(adminFetchUsers()));
                  }
                  return Promise.all(requests);
                }}
              >
                <DataRequestCreate />
              </ProtectedContent>
            }
          />
        </Route>
        <Route path='*' element={<Navigate to='' replace />} />
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
                preload={() =>
                  Promise.all([
                    dispatch(fetchProjects()),
                    dispatch(fetchCoreMetadata(props.match.params[0])),
                  ])
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
      </Route>
    </Routes>
  );
}

export default App;
