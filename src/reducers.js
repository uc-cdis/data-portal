import { reducer as formReducer } from 'redux-form';
import { combineReducers } from 'redux';
import userProfile from './UserProfile/reducers';
import coreMetadata from './CoreMetadata/reducers';
import certificate from './UserAgreement/reducers';
import submission from './Submission/reducers';
import analysis from './Analysis/reducers';
import homepage from './Homepage/reducers';
import queryNodes from './QueryNode/reducers';
import popups from './Popup/reducers';
import graphiql from './GraphQLEditor/reducers';
import explorer from './Explorer/reducers';
import login from './Login/reducers';
import bar from './Layout/reducers';
import ddgraph from './DataDictionary/reducers';
import { logoutListener } from './Login/ProtectedContent';

const status = (state = {}, action) => {
  switch (action.type) {
  case 'REQUEST_ERROR':
    return { ...state, request_state: 'error', error_type: action.error };
  default:
    return state;
  }
};

const versionInfo = (state = {}, action) => {
  switch (action.type) {
  case 'RECEIVE_VERSION_INFO':
    return { ...state,
      dictionaryVersion: action.data.dictionary.version || 'unknown',
      apiVersion: action.data.version || 'unknown',
    };
  default:
    return state;
  }
};

const user = (state = {}, action) => {
  switch (action.type) {
  case 'RECEIVE_USER':
    return { ...state, ...action.user, fetched_user: true };
  case 'REGISTER_ROLE':
    return {
      ...state, role_arn: action.role_arn };
  case 'RECEIVE_VPC':
    return {
      ...state, vpc: action.vpc,
    };
  case 'RECEIVE_AUTHORIZATION_URL':
    return { ...state, oauth_url: action.url };
  case 'FETCH_ERROR':
    return { ...state, fetched_user: true, fetch_error: action.error };
  default:
    return state;
  }
};

export const removeDeletedNode = (state, id) => {
  const searchResult = state.search_result;
  const nodeType = Object.keys(searchResult.data)[0];
  const entities = searchResult.data[nodeType];
  searchResult.data[nodeType] = entities.filter(entity => entity.id !== id);
  return searchResult;
};

const reducers = combineReducers({ explorer,
  bar,
  homepage,
  popups,
  user,
  status,
  versionInfo,
  submission,
  analysis,
  queryNodes,
  userProfile,
  coreMetadata,
  certificate,
  graphiql,
  login,
  form: formReducer,
  auth: logoutListener,
  ddgraph,
});

export default reducers;
