import { connect } from 'react-redux';
import SubmissionHeader from './SubmissionHeader';
import { fetchWithCreds } from '../actions';
import { FETCH_LIMIT, STARTING_DID } from './utils';
import { indexdPath, useIndexdAuthz } from '../localconf';

const fetchUnmappedFileStats = (username, totalSize, start, fetchLimit) => (
  dispatch
) => {
  const unmappedFilesCheck = useIndexdAuthz ? 'authz=null' : 'acl=null';
  return fetchWithCreds({
    path: `${indexdPath}index?${unmappedFilesCheck}&uploader=${username}&start=${start}&limit=${fetchLimit}`,
    method: 'GET',
  })
    .then(
      ({ status, data }) => {
        switch (status) {
          case 200:
            totalSize = totalSize.concat(data.records);
            if (data.records?.length === fetchLimit) {
              return dispatch(
                fetchUnmappedFileStats(
                  username,
                  totalSize,
                  data.records[fetchLimit - 1].did,
                  fetchLimit
                )
              );
            }
            return {
              type: 'RECEIVE_UNMAPPED_FILE_STATISTICS',
              data: {
                count: totalSize.length,
                totalSize: totalSize.reduce(
                  (total, current) => total + current.size,
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
      if (msg) {
        dispatch(msg);
      }
    });
};

const ReduxSubmissionHeader = (() => {
  const mapStateToProps = (state) => ({
    unmappedFileCount: state.submission.unmappedFileCount,
    unmappedFileSize: state.submission.unmappedFileSize,
    username: state.user.username,
  });

  const mapDispatchToProps = (dispatch) => ({
    fetchUnmappedFileStats: (username) =>
      dispatch(fetchUnmappedFileStats(username, [], STARTING_DID, FETCH_LIMIT)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(SubmissionHeader);
})();

export default ReduxSubmissionHeader;
