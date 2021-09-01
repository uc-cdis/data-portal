import { combineReducers } from 'redux';
import userProfile from './UserProfile/reducers';
import coreMetadata from './CoreMetadata/reducers';
import submission from './Submission/reducers';
import analysis from './Analysis/reducers';
import index from './Index/reducers';
import queryNodes from './QueryNode/reducers';
import popups from './Popup/reducers';
import graphiql from './GraphQLEditor/reducers';
import login from './Login/reducers';
import ddgraph from './DataDictionary/reducers';

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
      return {
        ...state,
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
      return {
        ...state,
        ...action.user,
        fetched_user: true,
        lastAuthMs: Date.now(),
      };
    case 'REGISTER_ROLE':
      return {
        ...state,
        role_arn: action.role_arn,
      };
    case 'RECEIVE_VPC':
      return {
        ...state,
        vpc: action.vpc,
      };
    case 'FETCH_ERROR':
      return { ...state, fetched_user: true, fetch_error: action.error };
    case 'RECEIVE_API_LOGOUT':
      return { ...state, lastAuthMs: 0 };
    default:
      return state;
  }
};

const userAccess = (state = { access: {} }, action) => {
  switch (action.type) {
    case 'RECEIVE_USER_ACCESS':
      return { ...state, access: action.data };
    default:
      return state;
  }
};

const project = (state = {}, action) => {
  const projects = {};
  const projectAvail = {};
  switch (action.type) {
    case 'RECEIVE_PROJECTS':
      for (const d of action.data) {
        projects[d.code] = d.project_id;
        projectAvail[d.project_id] = d.availability_type;
      }
      return { ...state, projects, projectAvail };
    default:
      return state;
  }
};

const reducers = combineReducers({
  index,
  project,
  popups,
  user,
  status,
  versionInfo,
  submission,
  analysis,
  queryNodes,
  userProfile,
  coreMetadata,
  graphiql,
  login,
  ddgraph,
  userAccess,
});

export default reducers;
