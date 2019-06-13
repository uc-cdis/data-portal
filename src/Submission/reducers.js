import { getFileNodes, getNodeTypes } from '../graphutils';
import { getDictionaryWithExcludeSystemProperties } from './utils';

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
      dictionary: getDictionaryWithExcludeSystemProperties(action.data),
      nodeTypes: getNodeTypes(action.data),
      file_nodes: getFileNodes(action.data),
    };
  case 'RECEIVE_AUTHORIZATION_URL':
    return { ...state, oauth_url: action.url };
  case 'RECEIVE_SUBMISSION_LOGIN':
    return { ...state, login: state.result, error: state.error };
  case 'RECEIVE_SUBMISSION': {
    const prevCounts = ('submit_entity_counts' in state) ? state.submit_entity_counts : {};
    const newCounts = (action.data.entities || [])
      .map(ent => ent.type || 'unknown')
      .reduce((db, type) => {
        const res = db; res[type] = (res[type] || 0) + 1;
        return res;
      }, prevCounts);
    const data = state.submit_result ?
      state.submit_result.concat(action.data.entities || [])
      : action.data.entities;
    const status = state.submit_status ?
      Math.max(state.submit_status, action.submit_status)
      : action.submit_status;
    return { ...state,
      submit_entity_counts: newCounts,
      submit_result: data,
      submit_result_string: state.submit_result_string.concat(JSON.stringify(action.data, null, '    ')).concat('\n\n'),
      submit_status: status,
      submit_counter: state.submit_counter + 1,
      submit_total: action.total };
  }
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
  case 'RECEIVE_UNMAPPED_FILES':
    return { ...state, unmappedFiles: action.data };
  case 'RECEIVE_UNMAPPED_FILE_STATISTICS':
    return {
      ...state,
      unmappedFileCount: action.data.count,
      unmappedFileSize: action.data.totalSize,
    };
  case 'RECEIVE_FILES_TO_MAP':
    return { ...state, filesToMap: action.data };
  case 'RESET_SUBMISSION_STATUS':
    return { ...state,
      submit_entity_counts: [],
      submit_result: null,
      submit_result_string: '',
      submit_status: 0,
      submit_counter: 0,
      submit_total: 0,
    };
  default:
    return state;
  }
};

export default submission;
