import { connect } from 'react-redux';
import SubmissionHeader from './SubmissionHeader';
import { fetchWithCreds } from '../actions';
import { FETCH_LIMIT, STARTING_DID } from './utils';
import { indexdPath, useIndexdAuthz } from '../localconf';

const fetchUnmappedFileStats = (username, total, start) => (dispatch) => {
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
  const mapStateToProps = (state) => ({
    unmappedFileCount: state.submission.unmappedFileCount,
    unmappedFileSize: state.submission.unmappedFileSize,
    username: state.user.username,
  });

  const mapDispatchToProps = (dispatch) => ({
    fetchUnmappedFileStats: (username) =>
      dispatch(fetchUnmappedFileStats(username, [], STARTING_DID)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(SubmissionHeader);
})();

export default ReduxSubmissionHeader;
