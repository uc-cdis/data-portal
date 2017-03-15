import 'babel-polyfill'
import { reducer as formReducer } from 'redux-form'
import { combineReducers } from 'redux'
import {routerReducer} from 'react-router-redux'

const status = (state={}, action) => {
  switch (action.type){
    case 'REQUEST_ERROR':
      return {...state, 'request_state': 'error', 'error_type': action.error}
    default:
      return state
  }
}

const user = (state={}, action) => {
  switch (action.type) {
    case 'RECEIVE_USER':
      return {...state, ...action.user, fetched_user: true};
    case 'REGISTER_ROLE':
      return {
        ...state, role_arn:action.role_arn}
    case 'RECEIVE_VPC':
      return {
        ...state, vpc: action.vpc
      }
    case 'FETCH_ERROR':
      return {...state, fetched_user: true, fetch_error: action.error}
    default:
      return state
  }
}

const login = (state={}, action) => {
  switch (action.type) {
    case 'RECEIVE_GOOGLE_URL':
      return {...state, google: action.url}
    default:
      return state
  }
}
const submission = (state={}, action) => {
  switch (action.type) {
    case 'REQUEST_UPLOAD':
      return {...state, file:action.file, file_type: action.file_type}
    case 'UPDATE_FILE':
      return {...state, file:action.file}
    case 'RECEIVE_PROJECTS':
      return {...state, projects:action.data}
    case 'RECEIVE_NODE_TYPES':
      return {...state, node_types: action.data}
    case 'RECEIVE_AUTHORIZATION_URL':
      return {...state, oauth_url:action.url}
    case 'RECEIVE_SUBMISSION_LOGIN':
      return {...state, login:state.result, error:state.error}
    case 'RECEIVE_SUBMISSION':
      return {...state, submit_result:action.data, submit_status:action.submit_status}
    case 'SUBMIT_SEARCH_FORM':
      return {...state, search_form: action.data}
    case 'RECEIVE_SEARCH_ENTITIES':
      return {...state, search_result: action.data, search_status: action.search_status}
    case 'REQUEST_DELETE_NODE':
      return {...state, request_delete_node: action.id}
    case 'DELETE_SUCCEED':
      return {...state, search_result: removeDeletedNode(state, action.id)}
    case 'DELETE_FAIL':
      return {...state, delete_error: action.error}
    case 'RECEIVE_QUERY_NODE':
      return {...state, query_node: action.data}
		case 'CLEAR_DELETE_SESSION':
			return {...state, query_node: null, delete_error: null}
    default:
      return state
  }
}

const removeDeletedNode = (state, id) =>{
  let search_result = state.search_result;
  console.log(search_result);
  // graphql response should always be {data: {node_type: [ nodes ] }}
  let node_type = Object.keys(search_result['data'])[0];
  let entities = search_result['data'][node_type];
  search_result['data'][node_type] = entities.filter((entity) => entity['id'] != id)
  return search_result;
}
const popups = (state={}, action) => {
  switch (action.type) {
    case 'UPDATE_POPUP':
      return {...state, ...action.data}
    default:
      return state
  }
}


const reducers = combineReducers({popups, login, user, status, submission, form: formReducer, routing:routerReducer})

export default reducers