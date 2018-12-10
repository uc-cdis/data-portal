import { connect } from 'react-redux';
import MapFiles from './MapFiles';
import { fetchWithCreds } from '../actions';
import { indexdPath } from '../localconf';

const fetchUnmappedFiles = () => dispatch => fetchWithCreds({
  path: `${indexdPath}index?acl=null`,
  method: 'GET',
}).then(
  ({ status, data }) => {
    switch (status) {
    case 200:
      return {
        type: 'RECEIVE_UNMAPPED_FILES',
        data: data.records,
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

const mapSelectedFiles = files => ({
  type: 'RECEIVE_FILES_TO_MAP',
  data: files,
});

const ReduxMapFiles = (() => {
  const mapStateToProps = state => ({
    unmappedFiles: state.submission.unmappedFiles,
  });

  const mapDispatchToProps = dispatch => ({
    fetchUnmappedFiles: () => dispatch(fetchUnmappedFiles()),
    mapSelectedFiles: files => dispatch(mapSelectedFiles(files)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(MapFiles);
})();

export default ReduxMapFiles;
