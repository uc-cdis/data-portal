import { connect } from 'react-redux';
import MapFiles from './MapFiles';
import { STARTING_DID } from './utils';
import { receiveFilesToMap } from './actions';
import { fetchUnmappedFiles } from './actions.thunk';

/** @typedef {import('redux-thunk').ThunkDispatch} ThunkDispatch */
/** @typedef {import('./types').SubmissionState} SubmissionState */
/** @typedef {import('../types').UserState} UserState */

const ReduxMapFiles = (() => {
  /** @param {{ submission: SubmissionState; user: UserState }} state */
  const mapStateToProps = (state) => ({
    unmappedFiles: state.submission.unmappedFiles,
    username: state.user.username,
  });

  /** @param {ThunkDispatch} dispatch */
  const mapDispatchToProps = (dispatch) => ({
    /** @param {UserState['username']} username */
    fetchUnmappedFiles: (username) => {
      dispatch(fetchUnmappedFiles(username, [], STARTING_DID));
    },
    /** @param {SubmissionState['filesToMap']} files */
    mapSelectedFiles: (files) => {
      dispatch(receiveFilesToMap(files));
    },
  });

  return connect(mapStateToProps, mapDispatchToProps)(MapFiles);
})();

export default ReduxMapFiles;
