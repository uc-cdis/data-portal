import { removeDeletedNode } from '../reducers';

const queryNodes = (state = {}, action) => {
  switch (action.type) {
  case 'SUBMIT_SEARCH_FORM':
    return { ...state, search_form: action.data };
  case 'RECEIVE_SEARCH_ENTITIES':
    return { ...state, search_result: action.data, search_status: action.search_status };
  case 'STORE_NODE_INFO':
    return { ...state, stored_node_info: action.id };
  case 'DELETE_SUCCEED':
    return { ...state, search_result: removeDeletedNode(state, action.id), delete_error: null };
  case 'DELETE_FAIL':
    return { ...state, delete_error: action.error };
  case 'RECEIVE_QUERY_NODE':
    return { ...state, query_node: action.data };
  case 'CLEAR_DELETE_SESSION':
    return { ...state, query_node: null, delete_error: null };
  case 'CLEAR_QUERY_NODES':
    return { ...state, query_node: null };
  default:
    return state;
  }
};

export default queryNodes;
