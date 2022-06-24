/* eslint-disable react/prop-types */
import { lazy, Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { matchPath, Navigate, Outlet, Route, Routes } from 'react-router-dom';
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
import { fetchVersionInfo } from './actions.thunk';
import { fetchGraphvizLayout } from './DataDictionary/actions.thunk';
import { fetchGuppySchema, fetchSchema } from './GraphQLEditor/actions.thunk';
import {
  fetchDictionary,
  fetchUnmappedFiles,
  fetchUnmappedFileStats,
} from './Submission/actions.thunk';
import { getProjectsList, getTransactionList } from './Submission/relayer';
import { STARTING_DID } from './Submission/utils';
import { fetchAccess } from './UserProfile/actions.thunk';
import useSessionMonitor from './hooks/useSessionMonitor';
import { fetchIndexPageCounts } from './Index/actions.thunk';

// lazy-loaded pages
const DataDictionary = lazy(() => import('./DataDictionary'));
const DataRequests = lazy(() => import('./DataRequests'));
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

function App() {
  useSessionMonitor();

  /** @type {import('redux-thunk').ThunkDispatch} */
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchVersionInfo());
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

                /** @type {import('./types').UserState} */
                const { username } = state.user;
                const start = STARTING_DID;

                if (matchPattern('/')) {
                  return Promise.all([
                    dispatch(getProjectsList()),
                    dispatch(getTransactionList()),
                    dispatch(fetchUnmappedFileStats(username, [], start)),
                  ]);
                }

                if (matchPattern('/files'))
                  return dispatch(fetchUnmappedFiles(username, [], start));

                if (matchPattern('/map') || matchPattern('/:project/*'))
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
            <ProtectedContent>
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
        <Route
          path='requests'
          element={
            <ProtectedContent>
              <DataRequests />
            </ProtectedContent>
          }
        />
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
