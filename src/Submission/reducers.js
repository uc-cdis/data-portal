export const submission = (state={}, action) => {
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
      return{ ...state, dictionary:action.data, node_types: Object.keys(action.data).filter( node => {return node.charAt(0) != '_'})};
    case 'RECEIVE_AUTHORIZATION_URL':
      return {...state, oauth_url:action.url};
    case 'RECEIVE_SUBMISSION_LOGIN':
      return {...state, login:state.result, error:state.error};
    case 'RECEIVE_SUBMISSION':
      return {...state, submit_result:action.data, submit_status:action.submit_status};
    case 'SUBMIT_SEARCH_FORM':
      return {...state, search_form: action.data};
    case 'RECEIVE_SEARCH_ENTITIES':
      return {...state, search_result: action.data, search_status: action.search_status};
    case 'RECEIVE_COUNTS':
      let links = {}
      for (var key in action.data) {
        if (!key.startsWith("_")) {
          links[key] = action.data[key].length
        }
      }
      return { ...state, counts_search: action.data, links_search: links};
    case 'CLEAR_COUNTS':
      return { ...state, counts_search: null, links_search: null};
    default:
      return state;
  }
};

