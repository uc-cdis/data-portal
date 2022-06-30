import { components } from '../params';
import { getFileNodes, getNodeTypes } from '../graphutils';
import { getDictionaryWithExcludeSystemProperties } from './utils';

/** @typedef {import('./types').SubmissionState} SubmissionState */

/** @type {import('redux').Reducer<SubmissionState>} */
const submission = (state = /** @type {SubmissionState} */ ({}), action) => {
  switch (action.type) {
    case 'REQUEST_UPLOAD':
      return { ...state, ...action.payload };
    case 'UPDATE_FILE':
      return { ...state, ...action.payload };
    case 'UPDATE_FORM_SCHEMA':
      return {
        ...state,
        formSchema: { ...state.formSchema, ...action.payload },
      };
    case 'RECEIVE_PROJECT_LIST': {
      //
      // Note - save projectsByName, b/c we acquire more data for individual tables
      // over time
      //
      const projectsByName = { ...(state.projectsByName || {}) };
      action.payload.projectList.forEach((proj) => {
        const old = projectsByName[proj.name] || {};
        projectsByName[proj.name] = Object.assign(old, proj);
      });
      const summaryCounts = {
        ...(state.summaryCounts || {}),
        ...action.payload.summaryCounts,
      };
      const lastestListUpdating = Date.now();
      // const { error, ...state } = state;
      return {
        ...state,
        projectsByName,
        summaryCounts,
        lastestListUpdating,
        countNames: components.charts.indexChartNames,
      };
    }
    case 'RECEIVE_PROJECT_DETAIL': {
      const projectsByName = { ...(state.projectsByName || {}) };
      projectsByName[action.payload.name] = action.payload;
      const lastestDetailsUpdating = Date.now();
      return { ...state, projectsByName, lastestDetailsUpdating };
    }
    case 'RECEIVE_TRANSACTION_LIST': {
      return { ...state, transactions: action.payload };
    }
    case 'RECEIVE_RELAY_FAIL': {
      return { ...state, error: action.payload };
    }
    case 'RECEIVE_DICTIONARY':
      return {
        ...state,
        dictionary: getDictionaryWithExcludeSystemProperties(action.payload),
        nodeTypes: getNodeTypes(action.payload),
        file_nodes: getFileNodes(action.payload),
      };
    case 'RECEIVE_SUBMISSION': {
      const prevCounts = state.submit_entity_counts ?? {};
      const newCounts = (action.payload.data.entities || [])
        .map((ent) => ent.type || 'unknown')
        .reduce((db, type) => {
          const res = db;
          res[type] = (res[type] || 0) + 1;
          return res;
        }, prevCounts);
      const data = state.submit_result
        ? state.submit_result.concat(action.payload.data.entities || [])
        : action.payload.data.entities;
      const status = state.submit_status
        ? Math.max(state.submit_status, action.payload.submit_status)
        : action.payload.submit_status;
      return {
        ...state,
        submit_entity_counts: newCounts,
        submit_result: data,
        submit_result_string: state.submit_result_string
          .concat(JSON.stringify(action.payload.data, null, '    '))
          .concat('\n\n'),
        submit_status: status,
        submit_counter: state.submit_counter + 1,
        submit_total: action.payload.submit_total,
      };
    }
    case 'SUBMIT_SEARCH_FORM':
      return { ...state, search_form: action.payload };
    case 'RECEIVE_SEARCH_ENTITIES':
      return { ...state, ...action.payload };
    case 'RECEIVE_COUNTS':
      return {
        ...state,
        counts_search: Object.entries(action.payload).reduce((acc, [k, v]) => {
          if (k.endsWith('_count')) acc[k] = v;
          return acc;
        }, {}),
        links_search: Object.entries(action.payload).reduce((acc, entry) => {
          acc[entry[0]] = entry[1].length;
          return acc;
        }, {}),
      };
    case 'CLEAR_COUNTS':
      return { ...state, counts_search: null, links_search: null };
    case 'RECEIVE_UNMAPPED_FILES':
      return { ...state, unmappedFiles: action.payload };
    case 'RECEIVE_UNMAPPED_FILE_STATISTICS':
      return { ...state, ...action.payload };
    case 'RECEIVE_FILES_TO_MAP':
      return { ...state, filesToMap: action.payload };
    case 'RESET_SUBMISSION_STATUS':
      return {
        ...state,
        submit_entity_counts: {},
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
