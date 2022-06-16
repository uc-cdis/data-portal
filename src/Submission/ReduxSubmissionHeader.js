import { connect } from 'react-redux';
import { fetchUnmappedFileStats } from './actions.thunk';
import SubmissionHeader from './SubmissionHeader';
import { STARTING_DID } from './utils';

/** @typedef {import('redux-thunk').ThunkDispatch} ThunkDispatch */
/** @typedef {import('./types').SubmissionState} SubmissionState */
/** @typedef {import('../types').UserState} UserState */

const ReduxSubmissionHeader = (() => {
  /** @param {{ submission: SubmissionState; user: UserState }} state */
  const mapStateToProps = (state) => ({
    unmappedFileCount: state.submission.unmappedFileCount,
    unmappedFileSize: state.submission.unmappedFileSize,
    username: state.user.username,
  });

  /** @param {ThunkDispatch} dispatch */
  const mapDispatchToProps = (dispatch) => ({
    /** @param {UserState['username']} username */
    fetchUnmappedFileStats: (username) => {
      dispatch(fetchUnmappedFileStats(username, [], STARTING_DID));
    },
  });

  return connect(mapStateToProps, mapDispatchToProps)(SubmissionHeader);
})();

export default ReduxSubmissionHeader;
