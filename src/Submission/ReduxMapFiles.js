import { connect } from 'react-redux';
import MapFiles from './MapFiles';
import { receiveFilesToMap } from './actions';

/** @typedef {import('redux-thunk').ThunkDispatch} ThunkDispatch */
/** @typedef {import('./types').SubmissionState} SubmissionState */

const ReduxMapFiles = (() => {
  /** @param {{ submission: SubmissionState }} state */
  const mapStateToProps = (state) => ({
    unmappedFiles: state.submission.unmappedFiles,
  });

  /** @param {ThunkDispatch} dispatch */
  const mapDispatchToProps = (dispatch) => ({
    /** @param {SubmissionState['filesToMap']} files */
    mapSelectedFiles: (files) => {
      dispatch(receiveFilesToMap(files));
    },
  });

  return connect(mapStateToProps, mapDispatchToProps)(MapFiles);
})();

export default ReduxMapFiles;
