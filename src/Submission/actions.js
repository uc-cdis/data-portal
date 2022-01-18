import { predictFileType } from '../utils';

/** @typedef {import('redux').Dispatch} Dispatch */
/** @typedef {import('./types').SubmissionState} SubmissionState */

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
