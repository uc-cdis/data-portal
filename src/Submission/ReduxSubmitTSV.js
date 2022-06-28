import { connect } from 'react-redux';
import SubmitTSV from './SubmitTSV';
import { requestUpload, resetSubmissionStatus, updateFile } from './actions';
import { getCounts, submitFileChunk } from './actions.thunk';
import { predictFileType } from '../utils';
import { getFileChunksToSubmit } from './utils';

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
  /**
   * @param {Object} args
   * @param {string} args.file
   * @param {string} args.fileType
   * @param {string} args.fullProject
   * @param {() => void} [args.callback]
   */
  onSubmitClick: ({ file, fileType, fullProject, callback }) => {
    dispatch(resetSubmissionStatus());

    const fileChunks = getFileChunksToSubmit({ file, fileType });
    const fileChunkTotal = fileChunks.length;
    async function submitFile() {
      for await (const fileChunk of fileChunks) {
        const args = { fileChunk, fileChunkTotal, fileType, fullProject };
        await dispatch(submitFileChunk(args));
        callback?.();
      }
    }
    submitFile();
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
