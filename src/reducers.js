import 'babel-polyfill';
import { reducer as formReducer } from 'redux-form';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { user_profile } from './UserProfile/reducers';
import { certificate } from './Certificate/reducers';
import { login } from './Login/reducers';
import { submission } from './Submission/reducers';
import { homepage } from './Homepage/reducers';
import { query_nodes } from './QueryNode/reducers';
import { popups } from './Popup/reducers';
import { graphiql } from './GraphQLEditor/reducers';
import { explorer } from "./Explorer/reducers";

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

export const removeDeletedNode = (state, id) =>{
  let search_result = state.search_result;
  console.log(search_result);
  let node_type = Object.keys(search_result['data'])[0];
  let entities = search_result['data'][node_type];
  search_result['data'][node_type] = entities.filter((entity) => entity['id'] !== id);
  return search_result;
};

const reducers = combineReducers({homepage, explorer, popups, login, user, status, submission, query_nodes, user_profile, certificate, graphiql, form: formReducer, routing:routerReducer});

export default reducers
