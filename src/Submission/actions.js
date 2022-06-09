import { fetchErrored, fetchWithCreds } from '../actions';
import { submissionApiPath } from '../localconf';
import { predictFileType } from '../utils';
import { buildCountsQuery } from './utils';

/** @typedef {import('redux').AnyAction} AnyAction */
/** @typedef {import('redux').Dispatch} Dispatch */
/** @typedef {import('./types').SubmissionState} SubmissionState */

/**
 * @param {Object} payload
 * @param {SubmissionState['file']} payload.file
 * @param {SubmissionState['file_type']} payload.file_type
 * @returns {AnyAction}
 */
export function requestUpload(payload) {
  return {
    type: 'REQUEST_UPLOAD',
    payload,
  };
}

/**
 * @param {Object} payload
 * @param {SubmissionState['file']} payload.file
 * @param {SubmissionState['file_type']} payload.file_type
 * @returns {AnyAction}
 */
export function updateFile(payload) {
  return {
    type: 'UPDATE_FILE',
    payload,
  };
}

/**
 * @param {SubmissionState['formSchema']} payload
 * @returns {AnyAction}
 */
export function updateFormSchema(payload) {
  return {
    type: 'UPDATE_FORM_SCHEMA',
    payload,
  };
}

/**
 * @param {Object} payload
 * @param {Object[]} payload.projectList
 * @param {SubmissionState['summaryCounts']} payload.summaryCounts
 * @returns {AnyAction}
 */
export function receiveProjectList(payload) {
  return {
    type: 'RECEIVE_PROJECT_LIST',
    payload,
  };
}

/**
 * @param {Object} payload
 * @returns {AnyAction}
 */
export function receiveProjectDetail(payload) {
  return {
    type: 'RECEIVE_PROJECT_DETAIL',
    payload,
  };
}

/**
 * @param {SubmissionState['transactions']} payload
 * @returns {AnyAction}
 */
export function receiveTransactionList(payload) {
  return {
    type: 'RECEIVE_TRANSACTION_LIST',
    payload,
  };
}

/**
 * @param {SubmissionState['error']} payload
 * @returns {AnyAction}
 */
export function receiveRelayFail(payload) {
  return {
    type: 'RECEIVE_RELAY_FAIL',
    payload,
  };
}

/**
 * @param {SubmissionState['dictionary']} payload
 * @returns {AnyAction}
 */
export function receiveDictionary(payload) {
  return {
    type: 'RECEIVE_DICTIONARY',
    payload,
  };
}

/**
 * @param {Object} payload
 * @param {Object} payload.data
 * @param {SubmissionState['submit_status']} payload.submit_status
 * @param {SubmissionState['submit_total']} payload.submit_total
 * @returns {AnyAction}
 */
export function receiveSubmission(payload) {
  return {
    type: 'RECEIVE_SUBMISSION',
    payload,
  };
}

/**
 * @param {SubmissionState['search_form']} payload
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
 * @param {SubmissionState['search_result']} payload.search_result
 * @param {SubmissionState['search_status']} payload.search_status
 * @returns {AnyAction}
 */
export function receiveSearchEntities(payload) {
  return {
    type: 'RECEIVE_SEARCH_ENTITIES',
    payload,
  };
}

/**
 * @param {Object} payload
 * @returns {AnyAction}
 */
export function receiveCounts(payload) {
  return {
    type: 'RECEIVE_COUNTS',
    payload,
  };
}

/** @returns {AnyAction} */
export function clearCounts() {
  return {
    type: 'CLEAR_COUNTS',
  };
}

/**
 * @param {SubmissionState['unmappedFiles']} payload
 * @returns {AnyAction}
 */
export function receiveUnmappedFiles(payload) {
  return {
    type: 'RECEIVE_UNMAPPED_FILES',
    payload,
  };
}

/**
 * @param {Object} payload
 * @param {SubmissionState['unmappedFileCount']} payload.unmappedFileCount
 * @param {SubmissionState['unmappedFileSize']} payload.unmappedFileSize
 * @returns {AnyAction}
 */
export function receiveUnmappedFileStatistics(payload) {
  return {
    type: 'RECEIVE_UNMAPPED_FILE_STATISTICS',
    payload,
  };
}

/**
 * @param {SubmissionState['filesToMap']} payload
 * @returns {AnyAction}
 */
export function receiveFilesToMap(payload) {
  return {
    type: 'RECEIVE_FILES_TO_MAP',
    payload,
  };
}

/** @returns {AnyAction} */
export function resetSubmissionStatus() {
  return {
    type: 'RESET_SUBMISSION_STATUS',
  };
}

/**
 * Compose and send a single graphql query to get a count of how
 * many of each node and edge are in the current state
 * @param {string} project
 */
export const getCounts =
  (project) =>
  /**
   * @param {Dispatch} dispatch
   * @param {() => { submission: SubmissionState }} getState
   */
  (dispatch, getState) => {
    const { dictionary, nodeTypes } = getState().submission;
    return fetchWithCreds({
      path: `${submissionApiPath}graphql`,
      body: JSON.stringify({
        query: buildCountsQuery(dictionary, nodeTypes, project),
      }),
      method: 'POST',
      dispatch,
    })
      .then(({ status, data }) => {
        switch (status) {
          case 200:
            return receiveCounts(data.data);
          default:
            return fetchErrored(data.data);
        }
      }, fetchErrored)
      .then((msg) => {
        dispatch(msg);
      });
  };

/**
 * @param {SubmissionState['file']} value
 * @param {SubmissionState['file_type']} type
 */
export const uploadTSV =
  (value, type) => (/** @type {Dispatch} */ dispatch) => {
    dispatch(requestUpload({ file: value, file_type: type }));
  };

/**
 * @param {SubmissionState['file']} value
 * @param {string} [fileType]
 */
export const updateFileContent =
  (value, fileType) => (/** @type {Dispatch} */ dispatch) => {
    dispatch(
      updateFile({
        file: value,
        file_type: predictFileType(value, fileType),
      })
    );
  };
