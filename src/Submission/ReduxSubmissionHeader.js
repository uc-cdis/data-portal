import { connect } from 'react-redux';
import SubmissionHeader from './SubmissionHeader';
import { fetchWithCreds } from '../actions';
import { FETCH_LIMIT, STARTING_DID } from './utils';
import { indexdPath, useIndexdAuthz } from '../localconf';

/** @typedef {import('redux-thunk').ThunkDispatch} ThunkDispatch */
/** @typedef {import('./types').SubmissionState} SubmissionState */
/** @typedef {import('../types').UserState} UserState */

/**
 *
 * @param {UserState['username']} username
 * @param {SubmissionState['unmappedFiles']} total
 * @param {string} start
 * @returns
 */
const fetchUnmappedFileStats =
  (username, total, start) => (/** @type {ThunkDispatch} */ dispatch) => {
    const unmappedFilesCheck = useIndexdAuthz ? 'authz=null' : 'acl=null';
    return fetchWithCreds({
      path: `${indexdPath}index?${unmappedFilesCheck}&uploader=${username}&start=${start}&limit=${FETCH_LIMIT}`,
      method: 'GET',
    })
      .then(
        ({ status, data }) => {
          switch (status) {
            case 200:
              total = total.concat(data.records ?? []);
              if (data.records?.length === FETCH_LIMIT) {
                return dispatch(
                  fetchUnmappedFileStats(
                    username,
                    total,
                    data.records[FETCH_LIMIT - 1].did
                  )
                );
              }
              return {
                type: 'RECEIVE_UNMAPPED_FILE_STATISTICS',
                data: {
                  count: total.length,
                  totalSize: total.reduce(
                    /**
                     * @param {number} size
                     * @param {Object} current
                     */
                    (size, current) => size + current.size,
                    0
                  ),
                },
              };

            default:
              return {
                type: 'FETCH_ERROR',
                error: data.records,
              };
          }
        },
        (err) => ({ type: 'FETCH_ERROR', error: err })
      )
      .then((msg) => {
        if (msg) dispatch(msg);
      });
  };

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
