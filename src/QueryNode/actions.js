/** @typedef {import('./types').QueryNodeState} QueryNodeState */
/** @typedef {import('redux').AnyAction} AnyAction */

/**
 * @param {QueryNodeState['search_form']} payload
 * @returns {AnyAction}
 */
export function submitSearchForm(payload) {
  return {
    type: 'SUBMIT_SEARCH_FORM',
    payload,
  };
}

/**
 * @param {Object} payload
 * @param {QueryNodeState['search_result']} payload.search_result
 * @param {QueryNodeState['search_status']} payload.search_status
 * @returns {AnyAction}
 */
export function receiveSearchEntities(payload) {
  return {
    type: 'RECEIVE_SEARCH_ENTITIES',
    payload,
  };
}

/**
 * @param {QueryNodeState['stored_node_info']} payload
 * @returns {AnyAction}
 */
export function storeNodeInfo(payload) {
  return {
    type: 'STORE_NODE_INFO',
    payload,
  };
}

/**
 * @param {string} payload Node ID
 * @returns {AnyAction}
 */
export function deleteSucceded(payload) {
  return {
    type: 'DELETE_SUCCEED',
    payload,
  };
}

/**
 * @param {QueryNodeState['delete_error']} payload
 * @returns {AnyAction}
 */
export function deleteErrored(payload) {
  return {
    type: 'DELETE_FAIL',
    payload,
  };
}

/**
 * @param {QueryNodeState['query_node']} payload
 * @returns {AnyAction}
 */
export function receiveQueryNode(payload) {
  return {
    type: 'RECEIVE_QUERY_NODE',
    payload,
  };
}

/** @returns {AnyAction} */
export function clearDeleteSession() {
  return {
    type: 'CLEAR_DELETE_SESSION',
  };
}

/** @returns {AnyAction} */
export function clearQueryNodes() {
  return {
    type: 'CLEAR_QUERY_NODES',
  };
}
