import { connect } from 'react-redux';
import SubmissionHeader from './SubmissionHeader';
import { fetchWithCreds } from '../actions';
import { indexdPath } from '../localconf';

const FETCH_LIMIT = 1024;

const fetchUnmappedFileStats = (user, totalSize, start) => dispatch => fetchWithCreds({
  path: `${indexdPath}index?acl=null&uploader=${user}&start=${start}&limit=${FETCH_LIMIT}`,
  method: 'GET',
}).then(
  ({ status, data }) => {
    switch (status) {
    case 200:
      totalSize = totalSize.concat(data.records);
      if (data.records.length === FETCH_LIMIT) {
        return dispatch(fetchUnmappedFileStats(user, totalSize, data.records[FETCH_LIMIT - 1].did));
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
  if (!!msg) {
    dispatch(msg);
  }
});

const getStartingUUID = user => dispatch => fetchWithCreds({
  path: `${indexdPath}index?acl=null&uploader=${user}&limit=1`,
  method: 'GET',
}).then(
  ({ status, data }) => {
    switch (status) {
    case 200:
      return data.records[0].did;
    default:
      return null;
    }
  },
).then(res => dispatch(fetchUnmappedFileStats(user, [], res)));

const ReduxSubmissionHeader = (() => {
  const mapStateToProps = state => ({
    unmappedFileCount: state.submission.unmappedFileCount,
    unmappedFileSize: state.submission.unmappedFileSize,
    user: state.user,
  });

  const mapDispatchToProps = dispatch => ({
    fetchUnmappedFileStats: user => dispatch(getStartingUUID(user)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(SubmissionHeader);
})();

export default ReduxSubmissionHeader;
