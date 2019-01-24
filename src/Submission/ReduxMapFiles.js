import { connect } from 'react-redux';
import MapFiles from './MapFiles';
import { fetchWithCreds } from '../actions';
import { indexdPath } from '../localconf';

const FETCH_LIMIT = 1024;

const fetchUnmappedFiles = (user, total, start) => dispatch => fetchWithCreds({
  path: `${indexdPath}index?acl=null&uploader=${user}&start=${start}&limit=${FETCH_LIMIT}`,
  method: 'GET',
}).then(
  ({ status, data }) => {
    switch (status) {
    case 200:
      total = total.concat(data.records);
      if (data.records.length === FETCH_LIMIT) {
        return dispatch(fetchUnmappedFiles(user, total, data.records[FETCH_LIMIT - 1].did));
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
).then(res => dispatch(fetchUnmappedFiles(user, [], res)));

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
    getStartingUUID: user => dispatch(getStartingUUID(user)),
    fetchUnmappedFiles: user => dispatch(getStartingUUID(user)),
    mapSelectedFiles: files => dispatch(mapSelectedFiles(files)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(MapFiles);
})();

export default ReduxMapFiles;
