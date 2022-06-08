import { combineReducers } from 'redux';
// import coreMetadata from './CoreMetadata/reducers';
import ddgraph from './DataDictionary/reducers';
import graphiql from './GraphQLEditor/reducers';
import index from './Index/reducers';
import login from './Login/reducers';
import queryNodes from './QueryNode/reducers';
import submission from './Submission/reducers';
import userProfile from './UserProfile/reducers';

/** @typedef {import('./types').KubeState} KubeState */
/** @typedef {import('./types').PopupState} PopupState */
/** @typedef {import('./types').ProjectState} ProjectState */
/** @typedef {import('./types').StatusState} StatusState */
/** @typedef {import('./types').UserState} UserState */
/** @typedef {import('./types').UserAccessState} UserAccessState */
/** @typedef {import('./types').VersionInfoState} VersionInfoState */

/** @type {import('redux').Reducer<KubeState>} */
const kube = (state = /** @type {KubeState} */ ({}), action) => {
  switch (action.type) {
    case 'RECEIVE_JOB_DISPATCH':
      return { ...state, job: action.payload };
    case 'RECEIVE_JOB_STATUS': {
      const { resultURL, ...job } = action.payload;
      return { ...state, job, resultURL };
    }
    case 'JOB_STATUS_INTERVAL':
      return { ...state, jobStatusInterval: action.payload };
    case 'RESET_JOB':
      return { ...state, job: null, jobStatusInterval: null, resultURL: null };
    default:
      return state;
  }
};

/** @type {import('redux').Reducer<PopupState>} */
const popups = (state = /** @type {PopupState} */ ({}), action) => {
  switch (action.type) {
    case 'UPDATE_POPUP':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

/** @type {import('redux').Reducer<ProjectState>} */
const project = (state = /** @type {ProjectState} */ ({}), action) => {
  /** @type {ProjectState['projects']} */
  const projects = {};
  /** @type {ProjectState['projectAvail']} */
  const projectAvail = {};
  switch (action.type) {
    case 'RECEIVE_PROJECTS':
      for (const p of action.payload) {
        projects[p.code] = p.project_id;
        projectAvail[p.project_id] = p.availability_type;
      }
      return { ...state, projects, projectAvail };
    default:
      return state;
  }
};

/** @type {import('redux').Reducer<StatusState>} */
const status = (state = /** @type {StatusState} */ ({}), action) => {
  switch (action.type) {
    case 'REQUEST_ERROR':
      return {
        ...state,
        error_type: action.payload,
        request_state: 'error',
      };
    default:
      return state;
  }
};

/** @type {import('redux').Reducer<UserState>} */
const user = (state = /** @type {UserState} */ ({}), action) => {
  switch (action.type) {
    case 'RECEIVE_USER':
      return {
        ...state,
        ...action.payload,
        fetched_user: true,
        lastAuthMs: Date.now(),
      };
    case 'FETCH_ERROR':
      return { ...state, fetched_user: true, fetch_error: action.payload };
    case 'RECEIVE_API_LOGOUT':
      return { ...state, lastAuthMs: 0 };
    default:
      return state;
  }
};

/** @type {import('redux').Reducer<UserAccessState>} */
const userAccess = (
  state = /** @type {UserAccessState} */ ({ access: {} }),
  action
) => {
  switch (action.type) {
    case 'RECEIVE_USER_ACCESS':
      return { ...state, access: action.data };
    default:
      return state;
  }
};

/** @type {import('redux').Reducer<VersionInfoState>} */
const versionInfo = (state = /** @type {VersionInfoState} */ ({}), action) => {
  switch (action.type) {
    case 'RECEIVE_VERSION_INFO':
      return {
        ...state,
        dataVersion: action.data || '',
      };
    default:
      return state;
  }
};

const reducers = combineReducers({
  // coreMetadata,
  ddgraph,
  index,
  graphiql,
  kube,
  login,
  popups,
  project,
  queryNodes,
  status,
  submission,
  user,
  userAccess,
  userProfile,
  versionInfo,
});

export default reducers;
