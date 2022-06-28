import { connect } from 'react-redux';
import SubmitTSV from './SubmitTSV';
import { requestUpload, updateFile } from './actions';
import { getCounts, submitToServer } from './actions.thunk';
import { predictFileType } from '../utils';

/** @typedef {import('redux-thunk').ThunkDispatch} ThunkDispatch */
/** @typedef {import('./types').SubmissionState} SubmissionState */

/** @param {{ submission: SubmissionState }} state */
const mapStateToProps = (state) => ({
  submission: state.submission,
});

/** @param {ThunkDispatch} dispatch */
const mapDispatchToProps = (dispatch) => ({
  /**
   * @param {SubmissionState['file']} file
   * @param {SubmissionState['file_type']} fileType
   */
  onUploadClick: (file, fileType) => {
    dispatch(requestUpload({ file, file_type: fileType }));
  },
  /** @param {string} project */
  onSubmitClick: (project, callback) => {
    dispatch(submitToServer({ fullProject: project, callback }));
  },
  /** @param {SubmissionState['file']} file */
  onFileChange: (file) => {
    dispatch(updateFile({ file, file_type: predictFileType(file) }));
  },
  /** @param {string} project */
  onFinish: (project) => {
    dispatch(getCounts(project));
  },
});

const ReduxSubmitTSV = connect(mapStateToProps, mapDispatchToProps)(SubmitTSV);
export default ReduxSubmitTSV;
