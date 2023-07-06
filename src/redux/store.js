import { configureStore } from '@reduxjs/toolkit';
import { mockStore, requiredCerts } from '../localconf';
import dataRequestReducer from './dataRequest/slice';
import ddgraphReducer from './ddgraph/slice';
import explorerReducer from './explorer/slice';
import graphiqlReducer from './graphiql/slice';
import indexReducer from './index/slice';
import kubeReducer from './kube/slice';
import loginReducer from './login/slice';
import popupsReducer from './popups/slice';
import projectReducer from './project/slice';
import queryNodesReducer from './queryNodes/slice';
import statusReducer from './status/slice';
import submissionReducer from './submission/slice';
import userReducer from './user/slice';
import userAccessReducer from './userAccess/slice';
import userProfileReducer from './userProfile/slice';
import versionInfoReducer from './versionInfo/slice';

const preloadedState = {
  user:
    process.env.NODE_ENV !== 'production' && mockStore
      ? { username: 'test', certificates_uploaded: requiredCerts }
      : {},
  status: {},
  versionInfo: {
    dataVersion: '',
    dictionaryVersion: '',
    portalVersion: process.env.PORTAL_VERSION,
  },
};

const store = configureStore({
  reducer: {
    dataRequest: dataRequestReducer,
    ddgraph: ddgraphReducer,
    explorer: explorerReducer,
    graphiql: graphiqlReducer,
    index: indexReducer,
    kube: kubeReducer,
    login: loginReducer,
    popups: popupsReducer,
    project: projectReducer,
    queryNodes: queryNodesReducer,
    status: statusReducer,
    submission: submissionReducer,
    user: userReducer,
    userAccess: userAccessReducer,
    userProfile: userProfileReducer,
    versionInfo: versionInfoReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState,
});

export default store;
