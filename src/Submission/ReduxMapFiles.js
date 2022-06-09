import { connect } from 'react-redux';
import MapFiles from './MapFiles';
import { fetchErrored, fetchWithCreds } from '../actions';
import { STARTING_DID, FETCH_LIMIT } from './utils';
import { indexdPath, useIndexdAuthz } from '../localconf';
import { receiveFilesToMap, receiveUnmappedFiles } from './actions';

/** @typedef {import('redux').AnyAction} AnyAction */
/** @typedef {import('redux-thunk').ThunkDispatch} ThunkDispatch */
/** @typedef {import('./types').SubmissionState} SubmissionState */
/** @typedef {import('../types').UserState} UserState */

/**
 * @param {UserState['username']} username
 * @param {SubmissionState['unmappedFiles']} total
 * @param {string} start
 */
const fetchUnmappedFiles =
  (username, total, start) => (/** @type {ThunkDispatch} */ dispatch) => {
    const unmappedFilesCheck = useIndexdAuthz ? 'authz=null' : 'acl=null';
    return fetchWithCreds({
      path: `${indexdPath}index?${unmappedFilesCheck}&uploader=${username}&start=${start}&limit=${FETCH_LIMIT}`,
      method: 'GET',
    })
      .then(({ status, data }) => {
        switch (status) {
          case 200:
            total = total.concat(data.records ?? []);
            if (data.records?.length === FETCH_LIMIT) {
              return dispatch(
                fetchUnmappedFiles(
                  username,
                  total,
                  data.records[FETCH_LIMIT - 1].did
                )
              );
            }
            return receiveUnmappedFiles(total);
          default:
            return fetchErrored(data.records);
        }
      }, fetchErrored)
      .then((msg) => {
        if (msg) dispatch(msg);
      });
  };

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
