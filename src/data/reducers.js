import 'babel-polyfill'
import { reducer as formReducer } from 'redux-form'
import { combineReducers } from 'redux'
import {routerReducer} from 'react-router-redux'

const status = (state={}, action) => {
  switch (action.type){
    case 'REQUEST_ERROR':
      return {...state, 'request_state': 'error', 'error_type': action.error};
    default:
      return state
  }
};

const user = (state={}, action) => {
  switch (action.type) {
    case 'RECEIVE_USER':
      return {...state, ...action.user, fetched_user: true};
    case 'REGISTER_ROLE':
      return {
        ...state, role_arn:action.role_arn};
    case 'RECEIVE_VPC':
      return {
        ...state, vpc: action.vpc
      };
    case 'RECEIVE_AUTHORIZATION_URL':
      return {...state, oauth_url:action.url};
    case 'FETCH_ERROR':
      return {...state, fetched_user: true, fetch_error: action.error};
    default:
      return state
  }
};

const cloud_access = (state={}, action) => {
  switch (action.type){
    case 'RECEIVE_CLOUD_ACCESS':
      return {...state, user: action.user, access_key_pairs: action.access_keys};
    case 'CLOUD_ACCESS_ERROR':
      return {...state, user: action.user, cloud_access_error: action.error};
    case 'RECEIVE_MIDDLEWARE_LOGIN':
      return {...state, login:state.result, error:state.error};
    case 'REQUEST_DELETE_KEY':
      return {...state, ...action.cloud_access, request_delete_key: action.access_key_id};
    case 'CREATE_SUCCEED':
      return {...state, ...action.cloud_access, access_key_pair: action.access_key_pair,
        str_access_key_pair: action.str_access_key_pair, create_error: null};
    case 'CREATE_USER_SUCCEED':
      return {...state, user: action.user, create_error: null};
    case 'CREATE_FAIL':
      return {...state, create_error: action.error};
    case 'DELETE_KEY_SUCCEED':
      return {...state, ...action.cloud_access, access_key_pairs: action.access_keys, delete_error: null};
    case 'DELETE_KEY_FAIL':
      return {...state, delete_error: action.error};
    case 'CLEAR_DELETE_KEY_SESSION':
      return {...state, delete_error: null};
    case 'CLEAR_CREATION_SESSION':
      return {...state, access_key_pair: null, str_access_key_pair: null, delete_error: null};
    case 'FETCH_ERROR':
      return {...state, fetch_error: action.error};
    default:
      return state
  }
};

const login = (state={}, action) => {
  switch (action.type) {
    case 'RECEIVE_GOOGLE_URL':
      return {...state, google: action.url};
    default:
      return state
  }
};

const submission = (state={}, action) => {
  switch (action.type) {
    case 'REQUEST_UPLOAD':
      return {...state, file:action.file, file_type: action.file_type};
    case 'UPDATE_FILE':
      return {...state, file:action.file, file_type: action.file_type};
    case 'RECEIVE_PROJECTS':
      return {...state, projects:action.data};
    case 'RECEIVE_NODE_TYPES':
      return {...state, node_types: action.data};
    case 'RECEIVE_DICTIONARY':
      return{ ...state, dictionary:action.data, node_types: Object.keys(action.data).slice(2,)};
    case 'RECEIVE_AUTHORIZATION_URL':
      return {...state, oauth_url:action.url};
    case 'RECEIVE_SUBMISSION_LOGIN':
      return {...state, login:state.result, error:state.error};
    case 'RECEIVE_SUBMISSION':
      return {...state, submit_result:action.data, submit_status:action.submit_status};
    case 'SUBMIT_SEARCH_FORM':
      console.log(action.data);
      return {...state, search_form: action.data};
    case 'RECEIVE_SEARCH_ENTITIES':
      return {...state, search_result: action.data, search_status: action.search_status};
    default:
      return state;
  }
};

const query_nodes = (state={}, action) => {
  switch (action.type) {
    case 'SUBMIT_SEARCH_FORM':
      return {...state, search_form: action.data};
    case 'RECEIVE_SEARCH_ENTITIES':
      return {...state, search_result: action.data, search_status: action.search_status};
    case 'STORE_NODE_INFO':
      return {...state, stored_node_info: action.id};
    case 'DELETE_SUCCEED':
      return {...state, search_result: removeDeletedNode(state, action.id), delete_error: null};
    case 'DELETE_FAIL':
      return {...state, delete_error: action.error};
    case 'RECEIVE_QUERY_NODE':
      return {...state, query_node: action.data};
    case 'CLEAR_DELETE_SESSION':
      return {...state, query_node: null, delete_error: null};
    case 'CLEAR_QUERY_NODES':
      return {...state, query_node: null};
    default:
      return state
  }
};

const removeDeletedNode = (state, id) =>{
  let search_result = state.search_result;
  console.log(search_result);
  // graphql response should always be {data: {node_type: [ nodes ] }}
  let node_type = Object.keys(search_result['data'])[0];
  let entities = search_result['data'][node_type];
  search_result['data'][node_type] = entities.filter((entity) => entity['id'] !== id);
  return search_result;
};

const popups = (state={}, action) => {
  switch (action.type) {
    case 'UPDATE_POPUP':
      return {...state, ...action.data};
    default:
      return state
  }
};


const reducers = combineReducers({popups, login, user, status, submission, query_nodes, cloud_access, form: formReducer, routing:routerReducer});

export default reducers
