import { getFileNodes, getNodeTypes } from '../graphutils';

const submission = (state = {}, action) => {
  switch (action.type) {
  case 'REQUEST_UPLOAD':
    return { ...state, file: action.file, file_type: action.file_type };
  case 'UPDATE_FILE':
    return { ...state, file: action.file, file_type: action.file_type };
  case 'UPDATE_FORM_SCHEMA':
    return { ...state, formSchema: { ...state.formSchema, ...action.formSchema } };
  case 'RECEIVE_PROJECTS':
    return { ...state,
      projects: action.data.reduce((map, p) => {
        const res = map;
        res[p.code] = p.project_id; return res;
      }, {}),
      projectAvail: action.data.reduce((map, p) => {
        const res = map;
        res[p.project_id] = p.availability_type; return res;
      }, {}),
    };
  case 'RECEIVE_NODE_TYPES':
    return { ...state, nodeTypes: action.data };
  case 'RECEIVE_DICTIONARY':
    return { ...state,
      dictionary: action.data,
      nodeTypes: getNodeTypes(action.data),
      file_nodes: getFileNodes(action.data),
    };
  case 'RECEIVE_AUTHORIZATION_URL':
    return { ...state, oauth_url: action.url };
  case 'RECEIVE_SUBMISSION_LOGIN':
    return { ...state, login: state.result, error: state.error };
  case 'RECEIVE_SUBMISSION':
    return { ...state, submit_result: action.data, submit_status: action.submit_status };
  case 'SUBMIT_SEARCH_FORM':
    return { ...state, search_form: action.data };
  case 'RECEIVE_SEARCH_ENTITIES':
    return { ...state, search_result: action.data, search_status: action.search_status };
  case 'RECEIVE_COUNTS':
    return { ...state,
      counts_search: action.data,
      links_search: Object.entries(action.data)
        .reduce((acc, entry) => { acc[entry[0]] = entry[1].length; return acc; }, {}),
    };
  case 'CLEAR_COUNTS':
    return { ...state, counts_search: null, links_search: null };
  default:
    return state;
  }
};

export default submission;
