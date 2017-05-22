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
      return{ ...state, dictionary:action.data, node_types: Object.keys(action.data).slice(2,)};
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
    default:
      return state;
  }
};

