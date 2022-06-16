import { connect } from 'react-redux';
import SubmitTSV from './SubmitTSV';
import {
  getCounts,
  uploadTSV,
  updateFileContent,
  submitToServer,
} from './actions.thunk';

/** @typedef {import('redux-thunk').ThunkDispatch} ThunkDispatch */
/** @typedef {import('./types').SubmissionState} SubmissionState */

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
