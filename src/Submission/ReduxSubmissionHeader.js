import { connect } from 'react-redux';
import SubmissionHeader from './SubmissionHeader';
import { fetchWithCreds } from '../actions';
import { indexdPath } from '../localconf';

const fetchUnmappedFileStats = () => dispatch => fetchWithCreds({
  path: `${indexdPath}index?acl=null`,
  method: 'GET',
}).then(
  ({ status, data }) => {
    switch (status) {
    case 200:
      return {
        type: 'RECEIVE_UNMAPPED_FILE_STATISTICS',
        data: {
          count: data.records.length,
          totalSize: data.records.reduce((total, current) => total + current.size, 0),
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
).then((msg) => { dispatch(msg); });

const ReduxSubmissionHeader = (() => {
  const mapStateToProps = state => ({
    unmappedFileCount: state.submission.unmappedFileCount,
    unmappedFileSize: state.submission.unmappedFileSize,
  });

  const mapDispatchToProps = dispatch => ({
    fetchUnmappedFileStats: () => dispatch(fetchUnmappedFileStats()),
  });

  return connect(mapStateToProps, mapDispatchToProps)(SubmissionHeader);
})();

export default ReduxSubmissionHeader;
