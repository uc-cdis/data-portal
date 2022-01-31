/** @typedef {import('./types').QueryNodeState} QueryNodeState */

/**
 * @param {QueryNodeState} state
 * @param {string} id
 */
const removeDeletedNode = (state, id) => {
  const searchResult = state.search_result;
  const nodeType = Object.keys(searchResult.data)[0];
  const entities = searchResult.data[nodeType];
  searchResult.data[nodeType] = entities.filter((entity) => entity.id !== id);
  return searchResult;
};

/** @type {import('redux').Reducer<QueryNodeState>} */
const queryNodes = (state = /** @type {QueryNodeState} */ ({}), action) => {
  switch (action.type) {
    case 'SUBMIT_SEARCH_FORM':
      return { ...state, search_form: action.data };
    case 'RECEIVE_SEARCH_ENTITIES':
      return {
        ...state,
        search_result: action.data,
        search_status: action.search_status,
      };
    case 'STORE_NODE_INFO':
      return { ...state, stored_node_info: action.id };
    case 'DELETE_SUCCEED':
      return {
        ...state,
        search_result: removeDeletedNode(state, action.id),
        delete_error: null,
      };
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
