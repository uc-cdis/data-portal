/* eslint-disable react/prop-types */
import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Spinner from './gen3-ui-component/components/Spinner/Spinner';

import Layout from './Layout';
import ReduxLogin, { fetchLogin } from './Login/ReduxLogin';
import ProtectedContent from './Login/ProtectedContent';
// import { fetchCoreMetadata } from './CoreMetadata/reduxer';
import { fetchAccess } from './UserProfile/ReduxUserProfile';
import {
  enableResourceBrowser,
  // workspaceUrl,
  // workspaceErrorUrl,
} from './localconf';
import { fetchVersionInfo } from './actions';
import useSessionMonitor from './hooks/useSessionMonitor';

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
  useSessionMonitor();
  useEffect(() => {
    store.dispatch(fetchVersionInfo());
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
            <ProtectedContent>
              <IndexPage />
            </ProtectedContent>
          }
        />
        <Route
          path='login'
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
          path='submission'
          element={
            <ProtectedContent isAdminOnly>
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
            <ProtectedContent>
              <GraphQLQuery />
            </ProtectedContent>
          }
        />
        <Route
          path='identity'
          element={
            <ProtectedContent filter={() => store.dispatch(fetchAccess())}>
              <UserProfile />
            </ProtectedContent>
          }
        />
        <Route
          path='dd/*'
          element={
            <ProtectedContent>
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
      </Route>
    </Routes>
  );
}

export default App;
