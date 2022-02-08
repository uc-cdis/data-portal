import { fetchWithCreds } from '../actions';
import { submissionApiPath } from '../localconf';
import { predictFileType } from '../utils';
import { buildCountsQuery } from './utils';

/** @typedef {import('redux').Dispatch} Dispatch */
/** @typedef {import('./types').SubmissionState} SubmissionState */

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
      .then(
        ({ status, data }) => {
          switch (status) {
            case 200:
              return {
                type: 'RECEIVE_COUNTS',
                data: data.data,
              };
            default:
              return {
                type: 'FETCH_ERROR',
                error: data.data,
              };
          }
        },
        (err) => ({ type: 'FETCH_ERROR', error: err })
      )
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
    dispatch({ type: 'REQUEST_UPLOAD', file: value, file_type: type });
  };

/** @param {SubmissionState['formSchema']} formSchema */
export const updateFormSchema = (formSchema) => ({
  type: 'UPDATE_FORM_SCHEMA',
  formSchema,
});

/**
 * @param {SubmissionState['file']} value
 * @param {string} [fileType]
 */
export const updateFileContent =
  (value, fileType) => (/** @type {Dispatch} */ dispatch) => {
    dispatch({
      type: 'UPDATE_FILE',
      file: value,
      file_type: predictFileType(value, fileType),
    });
  };
