import { reducer as formReducer } from 'redux-form';
import { combineReducers } from 'redux';
import userProfile from './UserProfile/reducers';
import certificate from './Certificate/reducers';
import submission from './Submission/reducers';
import homepage from './Homepage/reducers';
import queryNodes from './QueryNode/reducers';
import popups from './Popup/reducers';
import graphiql from './GraphQLEditor/reducers';
import explorer from './Explorer/reducers';
import { logoutListener } from './Login/ProtectedContent';

const status = (state = {}, action) => {
  switch (action.type) {
  case 'REQUEST_ERROR':
    return { ...state, request_state: 'error', error_type: action.error };
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
  homepage,
  popups,
  user,
  status,
  submission,
  queryNodes,
  userProfile,
  certificate,
  graphiql,
  form: formReducer,
  auth: logoutListener,
});

export default reducers;
