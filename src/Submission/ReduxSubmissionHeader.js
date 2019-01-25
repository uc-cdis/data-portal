import { connect } from 'react-redux';
import SubmissionHeader from './SubmissionHeader';
import { fetchWithCreds } from '../actions';
import { FETCH_LIMIT, STARTING_DID } from './utils';
import { indexdPath } from '../localconf';

const fetchUnmappedFileStats = (user, totalSize, start, fetchLimit) => dispatch => fetchWithCreds({
  path: `${indexdPath}index?acl=null&uploader=${user}&start=${start}&limit=${fetchLimit}`,
  method: 'GET',
}).then(
  ({ status, data }) => {
    switch (status) {
    case 200:
      totalSize = totalSize.concat(data.records);
      if (data.records.length === fetchLimit) {
        return dispatch(
          fetchUnmappedFileStats(user, totalSize, data.records[fetchLimit - 1].did, fetchLimit),
        );
      }
      return {
        type: 'RECEIVE_UNMAPPED_FILE_STATISTICS',
        data: {
          count: totalSize.length,
          totalSize: totalSize.reduce((total, current) => total + current.size, 0),
        },
      };

    default:
      return {
        type: 'FETCH_ERROR',
        error: data.records,
      };
    }
  },
  err => ({ type: 'FETCH_ERROR', error: err }),
).then((msg) => {
  if (msg) {
    dispatch(msg);
  }
});

const ReduxSubmissionHeader = (() => {
  const mapStateToProps = state => ({
    unmappedFileCount: state.submission.unmappedFileCount,
    unmappedFileSize: state.submission.unmappedFileSize,
    user: state.user,
  });

  const mapDispatchToProps = dispatch => ({
    fetchUnmappedFileStats: user => dispatch(
      fetchUnmappedFileStats(user, [], STARTING_DID, FETCH_LIMIT),
    ),
  });

  return connect(mapStateToProps, mapDispatchToProps)(SubmissionHeader);
})();

export default ReduxSubmissionHeader;
