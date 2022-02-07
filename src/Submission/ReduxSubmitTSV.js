import { connect } from 'react-redux';
import SubmitTSV from './SubmitTSV';
import { getCounts } from '../DataModelGraph/ReduxDataModelGraph';
import { submissionApiPath, lineLimit } from '../localconf';
import { fetchWithCreds } from '../actions';
import { uploadTSV, updateFileContent } from './actions';

/** @typedef {import('redux').Dispatch} Dispatch */
/** @typedef {import('redux-thunk').ThunkDispatch} ThunkDispatch */
/** @typedef {import('./types').SubmissionState} SubmissionState */

/**
 * @param {Object} args
 * @param {string} args.fullProject
 * @param {string} [args.methodIn]
 * @param {() => void} [args.callback]
 */
const submitToServer =
  ({ fullProject, methodIn = 'PUT', callback }) =>
  /**
   * @param {Dispatch} dispatch
   * @param {() => { submission: SubmissionState }} getState
   */
  (dispatch, getState) => {
    dispatch({ type: 'RESET_SUBMISSION_STATUS' });

    /** @type {string[]} */
    const fileArray = [];
    const path = fullProject.split('-');
    const program = path[0];
    const project = path.slice(1).join('-');
    const { submission } = getState();
    const method = /* path === 'graphql' ? 'POST' : */ methodIn;

    let { file } = submission;
    if (!file) {
      return Promise.reject(new Error('No file to submit'));
    }
    if (submission.file_type !== 'text/tab-separated-values') {
      // remove line break in json file
      file = file.replace(/\r\n?|\n/g, '');
    }

    if (submission.file_type === 'text/tab-separated-values') {
      const fileSplited = file.split(/\r\n?|\n/g);
      if (fileSplited.length > lineLimit && lineLimit > 0) {
        let fileHeader = fileSplited[0];
        fileHeader += '\n';
        let count = lineLimit;
        let fileChunk = fileHeader;

        for (let i = 1; i < fileSplited.length; i += 1) {
          if (fileSplited[i] !== '') {
            fileChunk += fileSplited[i];
            fileChunk += '\n';
            count -= 1;
          }
          if (count === 0) {
            fileArray.push(fileChunk);
            fileChunk = fileHeader;
            count = lineLimit;
          }
        }
        if (fileChunk !== fileHeader) {
          fileArray.push(fileChunk);
        }
      } else {
        fileArray.push(file);
      }
    } else {
      fileArray.push(file);
    }

    let subUrl = submissionApiPath;
    if (program !== '_root') {
      subUrl = `${subUrl + program}/${project}/`;
    }

    const totalChunk = fileArray.length;

    /** @param {string[]} chunkArray */
    function recursiveFetch(chunkArray) {
      if (chunkArray.length === 0) {
        return null;
      }

      return fetchWithCreds({
        path: subUrl,
        method,
        customHeaders: new Headers({ 'Content-Type': submission.file_type }),
        body: chunkArray.shift(),
        dispatch,
      })
        .then(recursiveFetch(chunkArray))
        .then(({ status, data }) => ({
          type: 'RECEIVE_SUBMISSION',
          submit_status: status,
          data,
          total: totalChunk,
        }))
        .then((msg) => dispatch(msg))
        .then(callback);
    }

    return recursiveFetch(fileArray);
  };

/** @param {{ submission: SubmissionState }} state */
const mapStateToProps = (state) => ({
  submission: state.submission,
});

/** @param {ThunkDispatch} dispatch */
const mapDispatchToProps = (dispatch) => ({
  /**
   * @param {SubmissionState['file']} value
   * @param {SubmissionState['file_type']} type
   */
  onUploadClick: (value, type) => {
    dispatch(uploadTSV(value, type));
  },
  /** @param {string} project */
  onSubmitClick: (project, callback) => {
    dispatch(submitToServer({ fullProject: project, callback }));
  },
  /** @param {SubmissionState['file']} value */
  onFileChange: (value) => {
    dispatch(updateFileContent(value));
  },
  /** @param {string} project */
  onFinish: (project) => {
    dispatch(getCounts(project));
  },
});

const ReduxSubmitTSV = connect(mapStateToProps, mapDispatchToProps)(SubmitTSV);
export default ReduxSubmitTSV;
