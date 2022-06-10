import { fetchErrored } from '../actions';
import { fetchWithCreds } from '../actions.thunk';
import { submissionApiPath } from '../localconf';
import { predictFileType } from '../utils';
import {
  receiveCounts,
  receiveDictionary,
  requestUpload,
  updateFile,
} from './actions';
import { buildCountsQuery } from './utils';

/** @typedef {import('redux').AnyAction} AnyAction */
/** @typedef {import('redux').Dispatch} Dispatch */
/** @typedef {import('./types').SubmissionState} SubmissionState */
export function fetchDictionary() {
  /**
   * @param {import('redux').Dispatch} dispatch
   * @param {() => { submission: SubmissionState }} getState
   */
  return (dispatch, getState) =>
    getState().submission.dictionary
      ? Promise.resolve()
      : import('../../data/dictionary.json').then(({ default: data }) =>
          dispatch(receiveDictionary(data))
        );
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
