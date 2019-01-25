import { connect } from 'react-redux';
import MapFiles from './MapFiles';
import { fetchWithCreds } from '../actions';
import { getStartingUUID } from './utils';
import { indexdPath } from '../localconf';

const fetchUnmappedFiles = (user, total, start, fetchLimit) => dispatch => fetchWithCreds({
  path: `${indexdPath}index?acl=null&uploader=${user}&start=${start}&limit=${fetchLimit}`,
  method: 'GET',
}).then(
  ({ status, data }) => {
    switch (status) {
    case 200:
      total = total.concat(data.records);
      if (data.records.length === fetchLimit) {
        return dispatch(
          fetchUnmappedFiles(user, total, data.records[fetchLimit - 1].did, fetchLimit),
        );
      }
      return {
        type: 'RECEIVE_UNMAPPED_FILES',
        data: total,
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

const mapSelectedFiles = files => ({
  type: 'RECEIVE_FILES_TO_MAP',
  data: files,
});

const ReduxMapFiles = (() => {
  const mapStateToProps = state => ({
    unmappedFiles: state.submission.unmappedFiles,
    user: state.user,
  });

  const mapDispatchToProps = dispatch => ({
    fetchUnmappedFiles: user => dispatch(getStartingUUID(user, fetchUnmappedFiles)),
    mapSelectedFiles: files => dispatch(mapSelectedFiles(files)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(MapFiles);
})();

export default ReduxMapFiles;
